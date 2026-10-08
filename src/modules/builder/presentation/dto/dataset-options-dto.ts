export interface DatasetOptionDto {
  readonly id: string;
  readonly name: string;
  readonly sourceName: string;
}

/**
 * Compatible datasets per canonical dataset type, loaded on the server for
 * the page's own website. The route builds it from the data-sources module;
 * the builder only displays it, so it never imports that module.
 */
export type DatasetOptionsByType = Readonly<
  Record<string, readonly DatasetOptionDto[]>
>;
