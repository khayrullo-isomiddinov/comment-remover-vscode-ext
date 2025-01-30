import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('comment-remover.removeComments', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found');
            return;
        }

        const document = editor.document;
        const languageId = document.languageId;
        const text = document.getText();
        
        // Remove comments based on language
        let cleanedText = removeComments(text, languageId);
        
        editor.edit(editBuilder => {
            const fullRange = new vscode.Range(
                document.positionAt(0),
                document.positionAt(text.length)
            );
            editBuilder.replace(fullRange, cleanedText);
        });
    });

    context.subscriptions.push(disposable);
}

function removeComments(code: string, languageId: string): string {
    const commentPatterns: { [key: string]: RegExp } = {
        'javascript': /\/\/.*|\/\*[\s\S]*?\*\//g,
        'typescript': /\/\/.*|\/\*[\s\S]*?\*\//g,
        'java': /\/\/.*|\/\*[\s\S]*?\*\//g,
        'c': /\/\/.*|\/\*[\s\S]*?\*\//g,
        'cpp': /\/\/.*|\/\*[\s\S]*?\*\//g,
        'python': /#.*$/gm,
        'php': /\/\/.*|\/\*[\s\S]*?\*\//g,
    };
    
    const regex = commentPatterns[languageId] || null;
    return regex ? code.replace(regex, '') : code;
}

export function deactivate() {}
