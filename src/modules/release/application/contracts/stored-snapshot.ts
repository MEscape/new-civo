export interface StoredReleaseSnapshot {
  readonly schemaVersion: number;
  readonly website: {
    readonly id: string;
    readonly name: string;
    readonly slug: string;
    readonly description: string | null;
  };
  readonly theme: {
    readonly primaryColor: string;
    readonly secondaryColor: string;
    readonly accentColor: string;
    readonly headingFont: string;
    readonly bodyFont: string;
    readonly radius: string;
    readonly spacingScale: string;
  };
  readonly pages: readonly any[];
  readonly dependencies: readonly any[];
}
