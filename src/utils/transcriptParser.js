export const cleanTranscript = (text) => {
    if (!text) return [];

    // 1. Split into lines
    let lines = text.split(/\r?\n/);

    // 2. Filter & Clean
    const steps = lines
        .map(line => {
            // Remove timestamps like [00:12], 00:12, 1:23
            let cleaned = line.replace(/\[?\d{1,2}:\d{2}\]?/g, '');

            // Remove leading/trailing markers like "- " or "1. "
            cleaned = cleaned.replace(/^[\s\d.-]+/, '');

            return cleaned.trim();
        })
        .filter(line => line.length > 0); // Remove empty lines

    return steps.map((text, index) => ({
        id: Date.now() + index, // Simple ID generation
        text
    }));
};
