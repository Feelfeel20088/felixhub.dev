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
      in 
      {
        packages = {
          default = extendedPkgs.felixhub;
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
