FROM ubuntu:24.04

# Update Repo dan Install SSH server
RUN apt-get update && apt-get install -y openssh-server
# Menambahkan direktori /run/sshd
RUN mkdir -p /run/sshd
# Membuat user non-root
RUN useradd -m -d /home/user -s /usr/bin/bash user
# Copy Public key dari client ke server
COPY ce_ecsda.pub /home/user/.ssh/authorized_keys
# security hardening
RUN sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin no/' /etc/ssh/sshd_config
RUN sed -i 's/#PubKeyAuthentication no/PubKeyAuthentication yes/' /etc/ssh/sshd_config

CMD [ "/usr/sbin/sshd", "-D", "-e" ]