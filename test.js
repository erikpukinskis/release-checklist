var runTest = require("run-test")(require)

runTest(
  "iterate through tasks with a tag",
  ["./"],
  function(expect, done, releaseChecklist) {

    var list = releaseChecklist("Ready to press cider")

    releaseChecklist.addTask(list, "Pick apples")

    releaseChecklist.addTask(list, "Clean press")

    releaseChecklist.addTask(list, "Wash bottles")

    releaseChecklist.tag(list, "Pick apples", "field work")

    var alreadyCalled = false

    list.eachTagged(
      "field work",
      function(task) {
        expect(task).to.equal("Pick apples")
        expect(alreadyCalled).to.be.false
        alreadyCalled = true
      }
    )

    done()
  }
)
