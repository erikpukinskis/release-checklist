var library = require("module-library")(require)


module.exports = library.export(
  "release-checklist",
  function() {
    var lists = {}

    function releaseChecklist(story, id) {

      var list = {
        id: id,
        story: story,
        tasks: [],
        tasksCompleted: [],
      }

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

    releaseChecklist.addTask = function(ref, task) {
      var list = get(ref)

      list.tasks.push(task)
    }

    releaseChecklist.checkOff = function(ref, text) {
      var list = get(ref)

      var i = list.tasks.indexOf(text)
      if (i < 0) {
        throw new Error("No task «"+text+"» on list "+(ref.id||ref))
      }
      list.tasksCompleted[i] = true
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

