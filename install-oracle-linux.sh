#!/usr/bin/env bash
set -Eeuo pipefail

cd "$(dirname "$0")"

if ! sudo swapon --show=NAME --noheadings | grep -qx '/swapfile'; then
  if [ ! -f /swapfile ]; then
    sudo fallocate -l 4G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
  fi
  sudo swapon /swapfile
fi

if ! sudo grep -qE '^/swapfile[[:space:]]' /etc/fstab; then
  printf '%s\n' '/swapfile swap swap defaults 0 0' | sudo tee -a /etc/fstab >/dev/null
fi
printf '%s\n' 'vm.swappiness=20' | sudo tee /etc/sysctl.d/99-kkutu.conf >/dev/null
sudo sysctl --system >/dev/null

if ! command -v docker >/dev/null 2>&1; then
  # OCI's large included/UEK repositories can cause severe swap thrashing on
  # the 512 MiB available to an E2.1.Micro guest.  The base, AppStream and
  # Docker repositories contain everything this deployment needs.
  sudo dnf config-manager --set-disabled \
    ol9_ksplice ol9_oci_included ol9_UEKR8 ol9_addons || true
  sudo dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
  sudo dnf -y \
    --disablerepo='*' \
    --enablerepo=ol9_baseos_latest \
    --enablerepo=ol9_appstream \
    --enablerepo=docker-ce-stable \
    --setopt=install_weak_deps=False install \
    docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
fi

sudo systemctl enable --now docker

if command -v firewall-cmd >/dev/null 2>&1 && sudo systemctl is-active --quiet firewalld; then
  sudo firewall-cmd --permanent --add-port=80/tcp
  sudo firewall-cmd --permanent --add-port=8080/tcp
  sudo firewall-cmd --permanent --add-port=8496/tcp
  sudo firewall-cmd --reload
fi

sudo docker compose up -d --build --wait --wait-timeout 600 db

echo "Importing the Morae basic, standard, and complex wordbooks..."
bash ./import-morae-words.sh
sudo docker compose up -d --build --wait --wait-timeout 1800

sudo docker compose ps
curl --fail --silent --show-error --head http://127.0.0.1/ >/dev/null
timeout 3 bash -c '</dev/tcp/127.0.0.1/8080'
timeout 3 bash -c '</dev/tcp/127.0.0.1/8496'

printf '%s\n' 'KKuTu is healthy on local ports 80, 8080, and 8496.'
