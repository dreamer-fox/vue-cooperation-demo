import "isomorphic-fetch";

export const Utility = {
  serverUrl: "http://localhost:8090/api/gcexcel/",
  webSocketUrl: "ws://localhost:8090/spreadjs",

  ServerCommands: {
    EditCell: "editCell",
    ResizeRow: "resizeRow",
    ResizeColumn: "resizeColumn",
    SetFontFamily: "setFontFamily",
    SetFontSize: "setFontSize",
    SetBackColor: "setBackColor",
    SetForeColor: "setForeColor",
    MoveFloatingObjects: "moveFloatingObjects",
    ResizeFloatingObjects: "resizeFloatingObjects",
    InsertColumns: "gc.spread.contextMenu.insertColumns",
    InsertRows: "gc.spread.contextMenu.insertRows",
    SetFontWeight: "setFontWeight",
    SetFontStyle: "setFontStyle",
    SetUnderline: "setUnderline",
    SetDoubleUnderline: "setDoubleUnderline"
  },

  getDocList() {
    var requestUrl = Utility.serverUrl + "docs";
    return fetch(requestUrl, {
      method: "GET"
    }).then(function(response) {
      if (response.ok) {
        return response.json();
      }
    });
  },

  openDocument(name) {
    var requestUrl = Utility.serverUrl + "xlsx/" + name;
    return fetch(requestUrl, {
      method: "POST"
    }).then(function(response) {
      if (response.ok) {
        return response.text();
      }
    });
  },

  OpenExcel(xlsxStream) {
    var requestUrl = Utility.serverUrl + "xlsx";
    return fetch(requestUrl, {
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      method: "POST",
      body: xlsxStream
    }).then(function(response) {
      if (response.ok) {
        return response.text();
      }
    });
  },

  ToJson(id) {
    var requestUrl = Utility.serverUrl + id + "/json";
    return fetch(requestUrl, {
      method: "GET"
    })
      .then(response => response.json())
      .then(data => {
        return data;
      });
  },

  ViewExcel(id) {
    var requestUrl = Utility.serverUrl + id + "/xlsx";
    window.open(requestUrl, "_blank");
  },

  ViewPdf(id) {
    var requestUrl = Utility.serverUrl + id + "/pdf";
    window.open(requestUrl, "_blank");
  },

  ViewJson(id) {
    var requestUrl = Utility.serverUrl + id + "/json";
    window.open(requestUrl, "_blank");
  },

  ViewImage(id) {
    var requestUrl = Utility.serverUrl + id + "/image";
    window.open(requestUrl, "_blank");
  },

  DownloadXlsx(id) {
    var requestUrl = Utility.serverUrl + id + "/xlsx";
    // window.location.href = requestUrl;
    fetch(requestUrl, {
      method: "Get"
    })
      .then(function(response) {
        var blob = response.blob();
        return blob;
      })
      .then(blob => {
        Utility.DownloadFile(
          blob,
          id,
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
      });
  },

  DownloadPdf(name) {
    var requestUrl = Utility.serverUrl + name + "/pdf";
    // window.location.href = requestUrl;
    fetch(requestUrl, {
      method: "Get"
    })
      .then(function(response) {
        var blob = response.blob();
        return blob;
      })
      .then(blob => {
        Utility.DownloadFile(blob, name, "application/pdf");
      });
  },

  CovertJsonToXlsx(ssjon, fileName) {
    var requestUrl = Utility.serverUrl + "jsonToXlsx";
    fetch(requestUrl, {
      method: "POST",
      body: ssjon
    })
      .then(function(response) {
        var blob = response.blob();
        return blob;
      })
      .then(blob => {
        if (!fileName) {
          fileName = "GcExcel-exported.xlsx";
        }
        Utility.DownloadFile(
          blob,
          fileName,
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
      });
  },

  DownloadFile(data, filename, mime) {
    var blob = new Blob([data], { type: mime || "application/octet-stream" });
    if (typeof window.navigator.msSaveBlob !== "undefined") {
      window.navigator.msSaveBlob(blob, filename);
    } else {
      var blobURL = window.URL.createObjectURL(blob);
      var tempLink = document.createElement("a");
      tempLink.href = blobURL;
      tempLink.setAttribute("download", filename);
      tempLink.setAttribute("target", "_blank");
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
    }
  },

  ExecuteCommandAtServer(command) {
    var requestUrl = Utility.serverUrl + command.cmd;

    return fetch(requestUrl, {
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json;charset=utf-8"
      },
      method: "POST",
      body: JSON.stringify(command)
    });
  }
}
