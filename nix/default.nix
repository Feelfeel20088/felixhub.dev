{pkgs, lib, buildNpmPackage}: final: prev:
let
  felixhub = buildNpmPackage {
    pname = "felixhub-portfolio-site";
    version = "1.0";

    src = ../.;

    npmDepsHash = "sha256-ap2iD0tZnivycTiDLuFsCuGeXp+291DM/ljq3nh1to4=";

    npmPackFlags = [ "--ignore-scripts" ];

    NODE_OPTIONS = "--openssl-legacy-provider";

    meta = {
      description = "Portfolio website for Felix Vujasin";
      homepage = "https://felixhub.dev";
      license = lib.licenses.gpl3Only;
      maintainers = with lib.maintainers; [ felix ];
    };
  };
in {
  inherit felixhub;
}
