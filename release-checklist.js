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

    releaseChecklist.addTag = function(ref, task, tag) {
      var list = get(ref)

      if (!list.tasksByTag[tag]) {
        list.tasksByTag[tag] = []
      }
      list.tasksByTag[tag].push(task)

      if (!list.tagsByTask[task]) {
        list.tagsByTask[task] = []
      }

      list.tagsByTask[task].push(tag)
    }

    function tagsForTask(task) {
      var tags = this.tagsByTask[task]
      console.log("tags for task", task, ":", tags)
      return tags || []
    }

    function eachTagged(tag, callback) {  
      if (!this.tasksByTag[tag]) { return }
      this.tasksByTag[tag].forEach(callback)     
    }

    function hasTag(task, tagId) {
      var tagsByTask = this.tagsByTask[task]
      if (!tagsByTask) {
        console.log("no tags for", task)
        return false
      }
      var i = tagsByTask[task].indexOf(tagId)
      console.log("looking for", tagId, "in", tagsByTask[task])
      return i >= 0
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
