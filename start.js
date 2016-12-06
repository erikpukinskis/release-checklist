var library = require("module-library")(require)

library.using(
  ["./", "web-element", "web-site", "browser-bridge", "tell-the-universe", "basic-styles"],
  function(releaseChecklist, element, WebSite, BrowserBridge, tellTheUniverse, basicStyles) {

    tellTheUniverse = tellTheUniverse.withNames({
      releaseChecklist: "release-checklist"
    })

    releaseChecklist("Someone can build a house", "4uwzyfhcsav8ia4i")

    var site = new WebSite()

    var storyForm = element("form", {method: "post", action: "/stories"}, [
      element("p", "Tell a story."),
      element("input", {type: "text", name: "story", placeholder: "Type what should happen"}),
      element("input", {type: "submit", value: "Make it so"}),
    ])

    var baseBridge = new BrowserBridge()

    baseBridge.addToHead(basicStyles)

    site.addRoute(
      "get",
      "/release-checklist",
      baseBridge.responseHandler(storyForm)
    )

    site.addRoute("post", "/stories", function(request, response) {

      var list = releaseChecklist(request.body.story)

      tellTheUniverse("releaseChecklist", list.story, list.id)

      bridge = baseBridge.forResponse(response)

      bridge.asap([list.id], function(id) {
        history.pushState(null, null, "/release-checklist/"+id)
      })

      renderChecklist(list, bridge)
    })

    site.addRoute("get", "/release-checklist/:id", function(request, response) {

      var list = releaseChecklist.get(request.params.id)

      if (!list) {
        throw new Error("No list "+request.params.id)
      }

      var bridge = baseBridge.forResponse(response)

      renderChecklist(list, bridge)
    })

    function renderChecklist(list, bridge) {
      // var render = renderTask.bind(null, list)

      // var tasks = list.tasks.forEach(render)

      var form = element("form", {method: "post", action: "/stories/"+list.id+"/tasks"}, [
        element("h1", list.story),
        // tasks,
        element("p", "Enter items to check off."),
        element("textarea", {name: "tasks"}),
        element("input", {type: "submit", value: "Add tasks"}),
      ])

      bridge.send(form)
    }

    // function renderTask(list, task) {
    //   return element("a", [checkBox(), element(task.description)])
    // }

    // site.addRoute("post", "/stories/:id/tasks", function(request, response) {
    //   var lines = request.body.tasks.split("\n")

    //   var list = releaseChecklist.get(id)
    //   var id = request.params.id

    //   lines.forEach(function(line) {
    //     var text = line.trim()

    //     if (text.length < 1) { return }

    //     releaseChecklist.addTask(list, text)
    //     tellTheUniverse("releaseChecklist.addTask", id, text)
    //   })

    //   renderChecklist(list, response)
    // })

    site.start(1441)
  }
)

// Release Checklist for selling a house

// project facilitator can write down a release checklist

// planner can add a project plan as a dependency to a task

// planner writes bond

// planner adds labor allocations to bond

// planner adds material allocations to bond

// reader can clock in

// investor reads a bind

// investor buys bond

// reader can clock out

// buyer receives bond purchase order

// buyer files receipt, [takes cash]

// buyer files materials receipts

// investor can monitor books

// investor can track progress

// investor can monitor payout status

// builder can register for work

// builder receives shifts

// worker clocks in and out

// builder receives task assignments

// worker can check tasks off

// buyer receives pay notification, [pays worker]

// sales receives production notification

// tester checks off release checklist

// homeowner buys house

// homeowner refers sales person

// homeowner provides delivery address

// buyer files receipt, [takes cash from homeowner]

// buyer files receipt for sales commission, [pays sales]

// truck driver receives delivery request

// buyer files receipt for gas, [pays driver]

// homeowner and driver file delivery notification

// buyer files delivery receipt, [pays driver]

// investor receives bond maturity notification

// investor requests share sale

// buyer files share sale receipt, [pays investor]

// programmer is assigned release task

// programmer marks task implemented

// worker flag themselves as stuck




