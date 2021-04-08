<template>
  <div>
    <gc-spread-sheets-designer
      :styleInfo="styleInfo"
      :config="config"
      @designerInitialized="designerInitialized"
    >
    </gc-spread-sheets-designer>
    <!-- <Designer :styleInfo="styleInfo" :config="config" @designerInitialized="designerInitialized"></Designer> -->
  </div>
</template>
<script>
import "@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css";
import "@grapecity/spread-sheets-designer/styles/gc.spread.sheets.designer.min.css";
import "@grapecity/spread-sheets-designer-resources-cn";
import GC from "@grapecity/spread-sheets";
GC.Spread.Common.CultureManager.culture("zh-cn");
import "@grapecity/spread-sheets-resources-zh";
import { Utility } from "../utility/index";
import { Designer } from "@grapecity/spread-sheets-designer-vue";
export default {
  data() {
    return {
      styleInfo: { height: "98vh", width: "100%" },
      config: null,
      designer: null
    };
  },
  methods: {
    designerInitialized(value) {
      this.designer = value;
      this.spread = this.designer.getWorkbook();
      var cm = this.spread.commandManager();
      cm.addListener("myListener", this.onCommandExecute);
    },
    onCommandExecute(args) {
      console.log(args.command);
      var command = args.command;
      var ServerCommand = null;
      switch (command.cmd) {
        case Utility.ServerCommands.EditCell:
          ServerCommand = {
            sheetName: command.sheetName,
            row: command.row,
            column: command.col,
            newValue: command.newValue
          };
          break;
        case Utility.ServerCommands.ResizeRow:
          ServerCommand = {
            sheetName: command.sheetName,
            rows: command.rows,
            size: command.size
          };
          break;
        case Utility.ServerCommands.ResizeColumn:
          ServerCommand = {
            sheetName: command.sheetName,
            columns: command.columns,
            size: command.size
          };
          break;
        case "Designer." + Utility.ServerCommands.SetFontFamily:
        case "Designer." + Utility.ServerCommands.SetFontSize:
        case "Designer." + Utility.ServerCommands.SetBackColor:
        case "Designer." + Utility.ServerCommands.SetForeColor:
        case "Designer." + Utility.ServerCommands.SetFontWeight:
        case "Designer." + Utility.ServerCommands.SetFontStyle:
        case "Designer." + Utility.ServerCommands.SetUnderline:
        case "Designer." + Utility.ServerCommands.SetDoubleUnderline:
          if (command.value && command.value.indexOf("undefined") === -1) {
            ServerCommand = {
              sheetName: command.sheetName,
              selections: command.selections,
              value: command.value
            };
          }
          break;
        case Utility.ServerCommands.MoveFloatingObjects:
          ServerCommand = {
            sheetName: command.sheetName,
            floatingObjects: command.floatingObjects,
            offsetX: command.offsetX,
            offsetY: command.offsetY
          };
          break;
        case Utility.ServerCommands.ResizeFloatingObjects:
          ServerCommand = {
            sheetName: command.sheetName,
            floatingObjects: command.floatingObjects,
            offsetX: command.offsetX,
            offsetY: command.offsetY,
            offsetWidth: command.offsetWidth,
            offsetHeight: command.offsetHeight
          };
          break;
        case Utility.ServerCommands.InsertColumns:
        case Utility.ServerCommands.InsertRows:
          ServerCommand = {
            sheetName: command.sheetName,
            selections: command.selections
          };
          break;
        default:
      }
      if (ServerCommand != null) {
        var cmd = command.cmd;
        var dotIndex = cmd.lastIndexOf(".");
        if (dotIndex !== -1) {
          cmd = cmd.substring(dotIndex + 1);
        }
        ServerCommand.cmd = cmd;
        ServerCommand.docID = this.docName;

        Utility.ExecuteCommandAtServer(ServerCommand);

        command.docID = ServerCommand.docID;
        this.webSocket.send(JSON.stringify(command));
      }
    },
    openDocument(docName) {
      Utility.openDocument(docName).then(() => {
        Utility.ToJson(docName).then(json => {
          this.spread.fromJSON(json);
          // this.bindSJSEvents();
        });
      });
    },
    connectDocument(docName) {
      if (this.webSocket != null) {
        return;
      }
      // var self = this;
      var ws = new WebSocket(Utility.webSocketUrl);
      ws.onopen = function() {
        var data = {
          cmd: "connect",
          docID: docName
        };
        ws.send(JSON.stringify(data));
      };
      ws.onmessage = this.onmessage;
      this.webSocket = ws;
    },
    onmessage(message) {
      var command = JSON.parse(message.data);
      command._styles = null;
      var cm = this.spread.commandManager();
      cm.removeListener("myListener");
      this.spread.commandManager().execute(command);
      cm.addListener("myListener", this.onCommandExecute);
    },
    importExcel(e) {
      var selectedFile = e.target.files[0];
      if (!selectedFile) {
        this.selectedFileName = null;
        return;
      }
      this.selectedFileName = selectedFile.name;
      Utility.OpenExcel(selectedFile).then(id => {
        this.serverInstanceId = id;
        Utility.ToJson(id).then(json => {
          this.spread.fromJSON(json);
          this.bindSJSEvents();
        });
      });
    }
  },
  mounted() {
    // this.docName = this.props.match.params.docName;
    this.docName = "test";
    this.openDocument(this.docName);
    this.connectDocument(this.docName);
  }
};
</script>
<style scoped></style>
