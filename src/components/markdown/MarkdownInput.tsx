import { EntryBase, GuideBase } from '@/redux/api/wildguideApi';
import { HStack, Textarea, VStack } from '@chakra-ui/react';
import { FieldValues, Path, UseFormRegisterReturn, UseFormWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { MarkdownInputPreview } from './MarkdownInputPreview';
import { MarkdownInputSnippets } from './MarkdownInputSnippets';

type Props<T extends FieldValues> = {
    register: UseFormRegisterReturn;
    watch: UseFormWatch<T>;
    placeholder: string;
}

export function MarkdownInput<T extends GuideBase | EntryBase>({ register, watch, placeholder }: Readonly<Props<T>>) {
    const { t } = useTranslation();
    const markdown = watch('description' as Path<T>) ?? '';
    return (
        <HStack width='100%' alignItems='flex-start'>
            <Textarea
                {...register}
                placeholder={t(placeholder)}
                variant='outline'
                minHeight={250}
                maxHeight={400}
            />
            <VStack>
                <MarkdownInputPreview markdown={markdown as string} />
                <MarkdownInputSnippets />
            </VStack>
        </HStack>
    );
}
