var library = require("module-library")(require)


module.exports = library.export(
  "release-checklist",
  ["./dasherize"],
  function(dasherize) {
    var lists = {}

    // Here ye here ye

    // Dasherizing is a thing here. Different strings cannot have the same dasherization. Not allowed. UIs are expected to prevent that.

    // In return for this strict chore, we have been blessed to know that the IDs of all tasks are always a sensible dasherization.

    // We can go back and update the DB with new dasherizations if one doth offend us

    function releaseChecklist(story, id) {

      var list = {
        id: id,
        story: story,
        tasks: [],
        tasksCompleted: [],
        tagData: {},
        tags: [],
        tasksByTag: {},
        tagsByTask: {},
      }

      list.eachTagged = eachTagged.bind(list)
      list.registerTag = registerTag.bind(list)
      list.taskIsCompleted = taskIsCompleted.bind(list)
      list.tagsForTask = tagsForTask.bind(list)
      list.hasTag = hasTag.bind(list)

      if (!list.id) { assignId(list) }
      lists[list.id] = list
      releaseChecklist.count++

      return list
    }

    releaseChecklist.count = 0

    releaseChecklist.get = get

    function get(ref) {
      if (!ref) {
        throw new Error("No ref!")
      }

      if (typeof ref == "string") {
        var list = lists[ref]
      } else {
        var list = ref
      }

      if (!list) {
        throw new Error("No list "+ref)
      }

      return list
    }

    releaseChecklist.addTask = function(ref, text) {

      var list = get(ref)

      list.tasks.push(text)
    }


    // Tags
 
    function registerTag(text, data) {
      var tagId = dasherize(text)
      if (this.tagData[tagId]) {
        return
      }
      this.tagData[tagId] = data
      var i = this.tags.length
      this.tags.push(text)
    }

    function taskIsCompleted(text) {
      return !!this.tasksCompleted[text]
    }

    releaseChecklist.tag = function(ref, taskText, tagText) {
      var list = get(ref)
      if (taskText == 0) { throw new Error("task is 0") }
      var taskId = dasherize(taskText)

      if (!list.tasksByTag[tagText]) {
        list.tasksByTag[tagText] = []
      }
      list.tasksByTag[tagText].push(taskText)

      if (!list.tagsByTask[taskId]) {
        list.tagsByTask[taskId] = []
      }

      console.log("THROW tagged", taskId, "ie", taskText, "with", tagText)
      list.tagsByTask[taskId].push(tagText)
    }

    releaseChecklist.untag = function(ref, taskText, tagText) {
      var list = get(ref)
      var taskId = dasherize(taskText)

      if (list.tasksByTag[tagText]) {
        remove(tagText, list.tasksByTag[tagText])
      }

      if (list.tagsByTask[taskId]) {
        remove(tagText, list.tagsByTask[taskId])
      }
    }

    function remove(item, array) {
      var i = array.indexOf(item)
      if (i < 0) { return }
      array.splice(i, 1)
    }

    function tagsForTask(text) {
      var taskId = dasherize(text)
      var tags = this.tagsByTask[taskId]
      console.log("CATCH tags for task", taskId, ":", tags)
      return tags || []
    }

    function eachTagged(tag, callback) {  
      if (!this.tasksByTag[tag]) { return }
      this.tasksByTag[tag].forEach(callback)     
    }

    function hasTag(taskText, tagText) {
      var taskId = dasherize(taskText)

      var tags = this.tagsByTask[taskId]
      if (!tags) {
        console.log("no tags for", taskText)
        return false
      }

      var tagId = dasherize(tagText)
      var i = tags.indexOf(tagText)
      var hasTag = i >= 0
      console.log("looking for", tagText, "in", tags, hasTag ? "yup" : "NOT FOUND")

      return hasTag
    }

    function taskIndex(list, text) {
      var i = list.tasks.indexOf(text)
      if (i < 0) {
        throw new Error("No task «"+text+"» on list "+(ref.id||ref))
      }
      return i
    }

    releaseChecklist.checkOff = function(ref, text) {
      var list = get(ref)
      var i = taskIndex(list, text)
      list.tasksCompleted[i] = true
    }

    releaseChecklist.uncheck = function(ref, text) {
      var list = get(ref)
      var i = taskIndex(list, text)
      list.tasksCompleted[i] = false
    }

    function assignId(list) {
      do {
        var id = "chk"+Math.random().toString(36).split(".")[1].substr(0,4)
      } while(lists[id])

      list.id = id
    }
    
    return releaseChecklist
  }
)
