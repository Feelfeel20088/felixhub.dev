{pkgs, lib, buildNpmPackage}: final: prev:
let
  felixhub = buildNpmPackage {
    pname = "felixhub-portfolio-site";
    version = "1.0";

    src = ../.;

    npmDepsHash = "sha256-ap2iD0tZnivycTiDLuFsCuGeXp+291DM/ljq3nh1to4=";

    npmPackFlags = [ "--ignore-scripts" ];

    NODE_OPTIONS = "--openssl-legacy-provider";

    propagatedBuildInputs = [ pkgs.nodejs_23 ];


    installPhase = ''
        mkdir -p $out/bin
        echo '#!/bin/sh' > $out/bin/felixhub-portfolio-site
        echo 'npm start' >> $out/bin/felixhub-portfolio-site
        chmod +x $out/bin/felixhub-portfolio-site
    '';


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
