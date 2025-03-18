import { Taxon } from './inatApi';
import { Entry, EntryBase } from './wildguideApi';

export function convertInatToEntryRank(inatRank: Taxon['rank']): EntryBase['scientificRank'] | undefined {
    switch (inatRank) {
        case 'family':
        case 'subfamily':
        case 'tribe':
        case 'subtribe':
        case 'genus':
        case 'subgenus':
        case 'species':
        case 'subspecies':
            return inatRank.toUpperCase() as Entry['scientificRank'];
        case 'variety':
        case 'form':
            return 'VARIETY_FORM_ABERRATION';
        default:
            return undefined;
    }
}
