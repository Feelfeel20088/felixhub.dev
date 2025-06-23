{
  lib,
  buildNpmPackage,
  fetchFromGitHub,
}: final: prev: let

    felixhub = buildNpmPackage (finalAttrs: {
    pname = "felixhub-portfolio-site";
    version = "1.0";

    src = ../.;

    npmDepsHash = "sha256-tuEfyePwlOy2/mOPdXbqJskO6IowvAP4DWg8xSZwbJw=";

    npmPackFlags = [ "--ignore-scripts" ];

    NODE_OPTIONS = "--openssl-legacy-provider";

    meta = {
        description = "Modern web UI for various torrent clients with a Node.js backend and React frontend";
        homepage = "https://felixhub.dev";
        license = lib.licenses.gpl3Only;
        maintainers = with lib.maintainers; [ felix ];
    };
    })
in {
    felixhub = final.felixhub;
}