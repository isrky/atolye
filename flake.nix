{
  description = "mypage dev shell (Playwright on NixOS)";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";

  outputs =
    { nixpkgs, ... }:
    let
      forAllSystems = nixpkgs.lib.genAttrs [
        "x86_64-linux"
        "aarch64-linux"
      ];
    in
    {
      devShells = forAllSystems (
        system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
          # Nix-patched browsers; only chromium is used (vitest browser mode + e2e).
          browsers = pkgs.playwright-driver.browsers.override {
            withFirefox = false;
            withWebkit = false;
          };
        in
        {
          default = pkgs.mkShellNoCC {
            PLAYWRIGHT_BROWSERS_PATH = "${browsers}";
            PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD = "1";
            PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS = "true";

            # The npm playwright version must match nixpkgs' playwright-driver,
            # otherwise it looks for browser revisions that don't exist here.
            shellHook = ''
              pw_pkg=node_modules/playwright-core/package.json
              if [ -f "$pw_pkg" ]; then
                pw_npm=$(sed -n 's/.*"version": *"\([^"]*\)".*/\1/p' "$pw_pkg" | head -n1)
                if [ "$pw_npm" != "${pkgs.playwright-driver.version}" ]; then
                  echo "warning: npm playwright $pw_npm != nixpkgs playwright-driver ${pkgs.playwright-driver.version}" >&2
                  echo "         align package.json with nixpkgs (or 'nix flake update')" >&2
                fi
              fi
            '';
          };
        }
      );
    };
}
