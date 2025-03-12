export function extractApiconfs(content: string) {
  const lines = content.split('\n');

  const results: {
    method: string;
    path: string;
    name: string;
    type: string;
    description: string;
    category: string;
  }[] = [];
  let currentConfig: any = null;
  let comments: string[] = [];
  let inMultilineComment = false;
  let multilineCommentBuffer = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Handle multi-line comments
    if (inMultilineComment) {
      const endCommentIndex = line.indexOf('*/');
      if (endCommentIndex !== -1) {
        multilineCommentBuffer += line.substring(0, endCommentIndex).trim();
        comments.push(multilineCommentBuffer);
        multilineCommentBuffer = '';
        inMultilineComment = false;
      } else {
        multilineCommentBuffer += line + ' ';
      }
      continue;
    }

    // Start of multi-line comment
    if (line.startsWith('/*')) {
      inMultilineComment = true;
      multilineCommentBuffer = line.substring(2) + ' ';
      if (line.endsWith('*/')) {
        const currentComment = multilineCommentBuffer
          .slice(0, multilineCommentBuffer.length - 3)
          .replace(/^\*+|\*+$/g, '') // remove * besides string
          .trim();

        comments.push(currentComment);
        inMultilineComment = false;
        multilineCommentBuffer = '';
      }
      continue;
    }

    // Collect single-line comments
    if (line.startsWith('//')) {
      comments.push(line.substring(2).trim());
      continue;
    }

    // Match API config declaration
    let configMatch = line.match(/^export\s+const\s+(\w+)Config\s*:\s*APIConfig\s*=/); // match `export const AddTodoConfig: APIConfig = {`
    if (!configMatch) configMatch = line.match(/^export\s+const\s+(\w+)Config\s*=/); // match `export const AddTodoConfig = {`

    if (configMatch && configMatch[1] && configMatch[1][0] === configMatch[1][0].toUpperCase()) {
      const name = configMatch[1];

      // Initialize new config object
      currentConfig = {
        name,
        method: '',
        path: '',
        type: '',
        description: comments.join(' ') || '',
        category: '',
      };

      // Reset comments after attaching them
      comments = [];

      // Continue parsing config object
      let j = i;
      let configComplete = false;
      let isInCommentOrTemplate = false; // /*, `

      while (j < lines.length && !configComplete) {
        const configLine = lines[j].trim();
        if (!isInCommentOrTemplate) {
          isInCommentOrTemplate = configLine.startsWith('/*');
        }
        if (isInCommentOrTemplate) {
          const commentEndIdx = configLine.indexOf('*/');
          if (commentEndIdx > -1) {
            isInCommentOrTemplate = false;
          }
        }
        if (isInCommentOrTemplate) {
          j++;
          continue;
        }
        // Extract method
        const methodMatch = configLine.match(/^method\s*:\s*['"`]([^'"`]+)['"`]/);
        if (methodMatch) {
          currentConfig.method = methodMatch[1];
        }

        // Extract path - now keeping the full expression for transformPath
        // First check for direct string path
        const pathDirectMatch = configLine.match(/^path\s*:\s*['"`]([^'"`]+)['"`]/);
        if (pathDirectMatch) {
          currentConfig.path = pathDirectMatch[1];
        } else {
          // Capture the full transformPath expression if present
          const transformPathMatch = configLine.match(/^path\s*:\s*(transformPath\([^)]+\))/);
          if (transformPathMatch) {
            currentConfig.path = transformPathMatch[1];
          } else {
            // Fallback for any other path format
            const generalPathMatch = configLine.match(/^path\s*:\s*(.+),?$/);
            if (generalPathMatch) {
              currentConfig.path = generalPathMatch[1].replace(/,$/, '').trim();
            }
          }
        }

        // Extract type
        const typeMatch = configLine.match(/^type\s*:\s*['"`]([^'"`]+)['"`]/);
        if (typeMatch) {
          currentConfig.type = typeMatch[1];
        }

        // Extract description
        // const descriptionMatch = configLine.match(/^description\s*:\s*['"`]([^'"`]+)['"`]/);
        // if (descriptionMatch) {
        //   currentConfig.description = descriptionMatch[1];
        // }

        // Extract category
        // const categoryMatch = configLine.match(/^category\s*:\s*['"`]([^'"`]+)['"`]/);
        // if (categoryMatch) {
        //   currentConfig.category = categoryMatch[1];
        // }

        // End config object when braces close
        // configLine.match(/}/g)
        if (/^}/.test(configLine) && !configLine.endsWith('*/') && !configLine.endsWith('`')) {
          configComplete = true;
          results.push(currentConfig);
          currentConfig = null;
        }

        j++;
      }

      // Update loop index
      i = j - 1;
    }
  }

  return results;
}
