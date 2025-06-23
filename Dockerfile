FROM nixos/nix

WORKDIR /app

COPY . .

RUN nix --extra-experimental-features 'flakes nix-command' build

EXPOSE 8080

CMD ["nix", "--extra-experimental-features", "flakes nix-command", "run", "."]
