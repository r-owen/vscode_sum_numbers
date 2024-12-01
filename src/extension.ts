import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const numRE = /\s*[$¢€¥£]?\s*([+-]?[0-9]*[.]?[0-9]*)/;
	const disposable = vscode.commands.registerCommand('extension.sumNumbers', function () {
		const editor = vscode.window.activeTextEditor;

		if (!editor) {
			return;
		}
		const document = editor.document;
		const selection = editor.selection;
		// set lastLineNum to the line number after selection end
		// (regardless of whether the selection ends within a line)
		let lastLineNum = editor.selection.end.line;
		if (editor.selection.end.character > 0) {
			lastLineNum++;
		}

		const numArray = [];
		let sum = 0;
		let lineNum = selection.start.line;
		for (lineNum = selection.start.line; lineNum < lastLineNum; ++lineNum) {
			const line = document.lineAt(lineNum);
			const numMatchArr = line.text.match(numRE);
			if ((numMatchArr == null) || (numMatchArr.length < 2)) {
				continue;
			}
			const value = parseFloat(numMatchArr[1]);
			if (isNaN(value)) {
				continue;
			}
			numArray.push(value);
			sum += value;
		}

		const result = "sum = " + sum + " of " + numArray.length + " numbers: " + numArray.join(", ") + "\n";
		const nextLinePosition = new vscode.Position(lastLineNum, 0);
		editor.edit(editBuilder => {
			editBuilder.insert(nextLinePosition, result);
		});
	});

	context.subscriptions.push(disposable);
}
