
type Props = {
    inaturalistTaxon?: number;
    inaturalistProject?: number;
}

export function EntryPhotos({ inaturalistTaxon, inaturalistProject }: Readonly<Props>) {
    console.log(inaturalistTaxon, inaturalistProject);
    return (
        <p>todo</p>
        // <InfiniteVirtualGrid
        // />
    );
}