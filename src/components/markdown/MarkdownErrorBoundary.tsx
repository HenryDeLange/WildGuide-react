import { Text } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';

type Props = {
    children: ReactNode;
}

export function MarkdownErrorBoundary({ children }: Readonly<Props>) {
    const { t } = useTranslation();
    return (
        <ErrorBoundary
            fallback={
                <Text color='fg.error'>
                    🐞 {t('markdownError')} 🐞
                </Text>
            }
            onError={(error, info) => console.warn(error, info)}
        >
            {children}
        </ErrorBoundary>
    );
}
