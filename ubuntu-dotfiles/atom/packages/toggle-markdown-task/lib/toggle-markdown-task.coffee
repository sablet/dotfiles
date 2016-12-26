{CompositeDisposable} = require 'atom'

module.exports = ToggleMarkdownTask =
  subscriptions: null

  activate: (state) ->
    @subscriptions = new CompositeDisposable
    @subscriptions.add atom.commands.add 'atom-text-editor',
      'toggle-markdown-task:toggle': => @toggle()

  deactivate: ->
    @subscriptions.dispose()

  toggle: ->
    if editor = atom.workspace.getActiveTextEditor()
      editor.transact =>
        editor.getSelections().forEach (selection) =>
          toggleSelection(selection)

toggleSelection = (selection) ->
  originalRange = selection.getBufferRange()

  rows = selection.getBufferRowRange()
  for row in [rows[0]..rows[1]]
    selection.cursor.setBufferPosition([row, 0])
    selection.selectToEndOfLine()

    toggledTask = toggleTask(selection.getText())
    selection.insertText(toggledTask)

  selection.setBufferRange(originalRange)

toggleTask = (taskText) ->
  if taskText.search(/\- \[ \]/) != -1
    taskText.replace /\- \[ \]/, "- [x]"
  else if taskText.search(/\- \[x\]/) != -1
    taskText.replace /\- \[x\]/, "- [ ]"
  else
    taskText
