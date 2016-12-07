var library = require("module-library")(require)

module.exports = library.export(
  "make-it-checkable",
  ["web-element", "function-call"],
  function(element, functionCall) {

    function makeItCheckable(el, bridge, handler) {

      var isCompleted = false

      el.children.unshift(checkBox(isCompleted))

      var id = el.assignId()

      if (isCompleted) {
        el.classes.push("task-completed")
      }

      el.classes.push("task-"+id)

      el.onclick(checkOffOnBridge(bridge).withArgs(functionCall.raw("event"), id, handler).evalable())
    }

    function checkOffOnBridge(bridge) {
      var checkOff = bridge.__makeItCheckableCheckOffBinding

      if (!checkOff) {
        checkOff = bridge.__makeItCheckableCheckOffBinding = bridge.defineFunction(function checkOff(event, id, callback) {
          event.preventDefault()
          var el = document.querySelector(".task-"+id)

          var isCompleted = el.classList.contains("task-completed")

          if (isCompleted) { return }

          el.classList.add("task-completed")

          callback(id)
        })
      }

      return checkOff
    }      

    var checkMark = element.template(
      ".check-mark",
      element.style({
        "visibility": "hidden"
      }),
      "✗"
    )

    var checkMarkChecked = element.style(".task-completed .check-mark", {
      "visibility": "visible",
      "color": "#888",
    })

    var checkBox = element.template(
      ".toggle-button",
      element.style({
        "border": "2px solid #888",
        // "vertical-align": "-0.15em",
        "background": "transparent",
        "width": "1.15em",
        "height": "1.15em",
        "margin-right": "0.5em",
        "padding": "1px 3px 0px 3px",
        "font-size": "1.15em",
        "line-height": "1em",
        "display": "inline-block",
        "cursor": "pointer",
        "box-sizing": "border-box",
      }),
      checkMark()
    )

    var taskCompleted = element.template(
      ".task-completed",
      element.style({
        "text-decoration": "line-through"
      })
    )

    makeItCheckable.stylesheet = element.stylesheet(checkMark, checkMarkChecked, checkBox, taskCompleted)

    return makeItCheckable
  }
)
