#!/bin/bash
# SSH Keys Installer for Anuj's servers
# Run: curl https://anujsh.com/ssh.sh | sh

set -e

KEYS=(
  "ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBGdaNTFylN4rZ2OR6D326SPpEOIIoFRHsK1/jvIZjd7S9lahefifkCfQ9DoDT+AyOFBq1+yOsb5UTQoACttQ01M= #ssh.id - @ptmaroct"
  "ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBIXFSiI0dulFf4NOzc6UbqhuGz1AifEfbHbfG6pux5fIG4npNLOniVP9uWCP9wnjEs3XYXRWqNd6vd5p+efpx+I= #ssh.id - @ptmaroct"
)

echo "Setting up SSH keys for Anuj's servers..."

# Create .ssh directory
mkdir -p "$HOME/.ssh"
chmod 700 "$HOME/.ssh"

# Add keys to authorized_keys
for key in "${KEYS[@]}"; do
  if ! grep -qF "$key" "$HOME/.ssh/authorized_keys" 2>/dev/null; then
    echo "$key" >> "$HOME/.ssh/authorized_keys"
    echo "Added key: ${key:0:50}..."
  else
    echo "Key already exists"
  fi
done

chmod 600 "$HOME/.ssh/authorized_keys"
echo "Done! SSH keys installed."
