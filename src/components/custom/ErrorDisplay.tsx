/* eslint-disable @typescript-eslint/no-explicit-any */
import { Heading, Text, VStack } from '@chakra-ui/react';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

type Props = {
    error?: FetchBaseQueryError | SerializedError | Error;
}

export function ErrorDisplay({ error }: Readonly<Props>) {
    if (!error) {
        return null;
    }
    console.error('APP ERROR:', error);
    return (
        <VStack padding={6}>
            <Heading size='3xl'>💥🦉💥</Heading>
            {(error as any).status &&
                <>
                    <Text>{(error as any).originalStatus ?? ''}</Text>
                    <Text>{(error as FetchBaseQueryError).status}</Text>
                    <Text>{(error as any).error ?? ''}</Text>
                    {(error as FetchBaseQueryError).data
                        ? ((error as FetchBaseQueryError).data as any).reason
                            ? <Text>{((error as FetchBaseQueryError).data as any).reason}</Text>
                            : <Text>{JSON.stringify((error as FetchBaseQueryError).data ?? '')}</Text>
                        : null}
                </>
            }
            {(error as any).code &&
                <>
                    <Text>{(error as SerializedError).code ?? ''}</Text>
                    <Text>{(error as SerializedError).message ?? ''}</Text>
                </>
            }
            {(error instanceof Error) &&
                <>
                    <Text>{error.name}</Text>
                    <Text>{error.message}</Text>
                </>
            }
        </VStack >
    );
}
