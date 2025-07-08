{pkgs}: final: prev:
let 
  felixhub = (with pkgs; buildNpmPackage {
    pname = "felixhub-portfolio-site";
    version = "1.0";

    src = ../.;
    # sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=
    npmDepsHash = "sha256-5IUp8HYCd9/qvGqENftNyQuKSvJ1Gj2hMW29hmp2xQ8=";


    npmPackFlags = [ "--ignore-scripts" ];

    NODE_OPTIONS = "--openssl-legacy-provider";

    buildInputs = [ typescript ];

    build = ''
      tsc
    '';

    postInstall = ''
      mkdir -p $out/app
      cp -r . $out/app/
    '';

    meta = {
      description = "Portfolio website for Felix";
      homepage = "https://felixhub.dev";
      license = lib.licenses.gpl3Only;
      maintainers = with lib.maintainers; [ felix ];
    };
  });
in {
  inherit felixhub;
}
