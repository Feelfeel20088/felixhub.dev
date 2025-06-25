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
        extendedPkgs = pkgs.extend (import ./nix/default.nix {
          inherit pkgs;
        });
        
      in {
        packages = {
          default = extendedPkgs.felixhub;

          dockerImage = pkgs.dockerTools.buildImage {
            name = "felixhub.dev";
            tag = "latest";

            # fromImage = pkgs.dockerTools.pullImage {
            #   imageName = "paketobuildpacks/nodejs";
            #   finalImageName = "paketobuildpacks/nodejs";
            #   finalImageTag = "latest";
            #   imageDigest = "sha256:8aaa7ef831b72dce5cfff67e5eaa651804fe43359a66c71c226651fc834ff53b";
            #   sha256 = "1VxV9ibVHHN9ABqDb0da9O2B6aiZipUlR3KUnhOkfnM=";
            # };

            config = {
              Cmd = [ "npm" "start" ];
              WorkingDir = "/app";
            };

            copyToRoot = pkgs.buildEnv {
              name = "felixhub-docker-root";
              paths = [
                pkgs.nodejs_22
                pkgs.bash
                extendedPkgs.felixhub
              ];
              pathsToLink = [ "/bin" "/app" ];
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
