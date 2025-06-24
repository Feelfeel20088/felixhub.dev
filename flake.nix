{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    flake-parts.url = "github:hercules-ci/flake-parts";
  };

  outputs = inputs @ { self, nixpkgs, flake-utils, flake-parts, ... }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      systems = flake-utils.lib.defaultSystems;

      perSystem = { system, pkgs, ... }: let
        felixhub = import ./nix/default.nix {
          inherit pkgs;
          lib = pkgs.lib;
          buildNpmPackage = pkgs.buildNpmPackage;
        };
        extendedPkgs = pkgs.extend felixhub;
      in {
        packages = {
          default = extendedPkgs.felixhub;

          dockerImage = pkgs.dockerTools.buildImage {
            name = "felixhub.dev";
            tag = "latest";

            fromImage = pkgs.dockerTools.pullImage {
              imageName = "paketobuildpacks/nodejs";
              finalImageTag = "latest";
              sha256 = "sha256-1VxV9ibVHHN9ABqDb0da9O2B6aiZipUlR3KUnhOkfnM=";
              imageDigest = "sha256-1VxV9ibVHHN9ABqDb0da9O2B6aiZipUlR3KUnhOkfnM=";
            };
            config = {
              Cmd = [ "npm" "start" ];
              WorkingDir = "/app";
            };

            copyToRoot = pkgs.buildEnv {
              name = "felixhub-docker-root";
              paths = [
                extendedPkgs.felixhub
              ];
              pathsToLink = [ "/app" ];
            };
          };
        };

        devShells.default = extendedPkgs.mkShell {
          buildInputs = [
            extendedPkgs.nodejs
            extendedPkgs.typescript
          ];
        };
      };
    };
}
