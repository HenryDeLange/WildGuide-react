import { Box, Separator, Text, Textarea } from '@chakra-ui/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ExtendedMarkdown } from './ExtendedMarkdown';

export function MarkdownInputSnippetSyntax() {
    const { t } = useTranslation();
    const [input, setInput] = useState(`# Heading 1

Normal markdown syntax is supported.

## Basic Text

<!-- Inline comments (like this) and basic HTML tags are supported. -->
Example <b>bold HTML</b> tag.
But using **markdown syntax** is better.
<br />
Text after the linebreak.

Normal paragraph of
text.

### Highlights

Words can be \`highlighted\` mid sentence.

\`\`\`
multi
line
highlighted
block
\`\`\`

> text quote block

## Lists

- item
- item
 - subitem

1. item 1
1. item 2

## Links

[Link to WildGuide](http://wildguide.mywild.co.za)

http://wildguide.mywild.co.za

# Extensions

Wildguide has powerful extensions to embed custom interactive components into the Markdown document.

For example a <Popup text="popup" content={custom popup content} /> can be added.

See the other sections for details on using the other extensions.

`);

    return (
        <Box>
            <Text>
                {t('markdownSnippetsSyntaxDetails')}
            </Text>
            <Separator marginY={4} />
            <Textarea
                value={input}
                onChange={event => setInput(event.target.value)}
                placeholder={t('markdownSnippetsSyntaxInput')}
                height={{ base: 190, md: 270 }}
            />
            <Box  bgColor={{ _light: '#BBB9', _dark: '#2229' }} marginTop={2}>
                <ExtendedMarkdown content={input} />
            </Box>
        </Box>
    );
}
