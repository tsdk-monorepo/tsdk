export function extractApiconfs(content: string) {
  const lines = content.split('\n');

  const results: {
    method: string;
    path: string;
    name: string;
    type: string;
    description: string;
    category: string;
    isGet?: boolean;
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
        if (multilineCommentBuffer.trim()) {
          comments.push(multilineCommentBuffer.trim());
        }
        multilineCommentBuffer = '';
        inMultilineComment = false;
      } else {
        multilineCommentBuffer += line + ' ';
      }
      continue;
    }

    // Start of multi-line comment
    if (line.startsWith('/*')) {
      const endIndex = line.indexOf('*/');
      if (endIndex !== -1) {
        // Single-line multi-line comment
        const comment = line
          .substring(2, endIndex)
          .replace(/^\*+|\*+$/g, '')
          .trim();
        if (comment) {
          comments.push(comment);
        }
      } else {
        inMultilineComment = true;
        multilineCommentBuffer = line.substring(2) + ' ';
      }
      continue;
    }

    // Collect single-line comments
    if (line.startsWith('//')) {
      const comment = line.substring(2).trim();
      if (comment) {
        comments.push(comment);
      }
      continue;
    }

    // Match API config declaration
    let configMatch = line.match(/^export\s+const\s+(\w+)Config\s*:\s*APIConfig\s*=/);
    if (!configMatch) {
      configMatch = line.match(/^export\s+const\s+(\w+)Config\s*=/);
    }

    if (configMatch && configMatch[1] && /^[A-Z]/.test(configMatch[1])) {
      const name = configMatch[1];

      // Initialize new config object
      currentConfig = {
        name,
        method: '',
        path: '',
        type: '',
        description: comments.join(' ').trim(),
        category: '',
      };

      // Reset comments after attaching them
      comments = [];

      // Continue parsing config object
      let j = i;
      let braceDepth = 0;
      let configStarted = false;
      let inComment = false;

      while (j < lines.length) {
        const configLine = lines[j].trim();

        // Track comment state
        if (!inComment && configLine.includes('/*')) {
          inComment = true;
        }
        if (inComment && configLine.includes('*/')) {
          inComment = false;
          j++;
          continue;
        }
        if (inComment) {
          j++;
          continue;
        }

        // Count braces
        for (const char of configLine) {
          if (char === '{') {
            braceDepth++;
            configStarted = true;
          } else if (char === '}') {
            braceDepth--;
          }
        }

        // Extract fields only when not in comment
        if (!inComment && configStarted) {
          // Extract method
          const methodMatch = configLine.match(/^\s*method\s*:\s*['"`]([^'"`]+)['"`]/);
          if (methodMatch) {
            currentConfig.method = methodMatch[1];
          }

          // Extract isGet
          const isGetMatch = configLine.match(/^\s*isGet\s*:\s*(\S+)/);
          if (isGetMatch) {
            currentConfig.isGet = isGetMatch[1].replace(/,\s*$/, '');
          }

          // Extract path
          const pathDirectMatch = configLine.match(/^\s*path\s*:\s*['"`]([^'"`]+)['"`]/);
          if (pathDirectMatch) {
            currentConfig.path = pathDirectMatch[1];
          } else {
            const transformPathMatch = configLine.match(/^\s*path\s*:\s*(transformPath\([^)]+\))/);
            if (transformPathMatch) {
              currentConfig.path = transformPathMatch[1];
            }
          }

          // Extract type
          const typeMatch = configLine.match(/^\s*type\s*:\s*['"`]([^'"`]+)['"`]/);
          if (typeMatch) {
            currentConfig.type = typeMatch[1];
          }
        }

        // End config when braces close completely
        if (configStarted && braceDepth === 0) {
          results.push(currentConfig);
          currentConfig = null;
          break;
        }

        j++;
      }

      // Update loop index
      i = j;
    } else {
      // Clear comments if we encounter non-comment, non-config line
      if (line && !line.startsWith('//') && !line.startsWith('/*')) {
        comments = [];
      }
    }
  }

  return results;
}
