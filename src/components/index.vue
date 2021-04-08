<template>
  <div class="app-root">
    <div class="app-container">
      <div class="title" style="text-align: center; margin-bottom: 20px">
        文档在线协同编辑Demo
      </div>
      <el-row>
        <el-col :span="12">
          <el-table height="642" @row-click="showDoc" :data="tableData" style="width: 100%">
            <el-table-column prop="date" label="日期" width="180">
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="180">
            </el-table-column>
            <el-table-column prop="mc" label="发起人"> </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="12">
          <div style="height: 600px" class="editor">
            <div class="editor-container" id="container"></div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import Editor from "../assets/js/editor";
import "quill/dist/quill.snow.css";
import EditorEvents from "../assets/js/editor-events";
import "../assets/js/task-list";

import ReconnectingWebSocket from "reconnecting-websocket";
import ShareDB from "sharedb/lib/client";
import Quill from "quill";
import richText from "rich-text";
ShareDB.types.register(richText.type);

// For icons of header value 3
const icons = Quill.import("ui/icons");
// icons['header'][3] = require('!html-loader!quill/assets/icons/header-3.svg');

// import '../display.styl';
export default {
  name: "index",
  data() {
    return {
      tableData: [
        {
          date: "2016-05-02",
          name: "test-doc",
          mc: "ALEEN"
        },
        {
          date: "2016-05-04",
          name: "test-doc1",
          mc: "Anna"
        },
        {
          date: "2016-05-01",
          name: "test-doc2",
          mc: "Bob"
        }
      ],
      docName: "test-doc"
    };
  },
  methods: {
    getConnect() {
      let editorOptions = {
        // authorship: {
        //     author: authors[authorIndex],
        //     authorColor: '#ed5634',
        //     colors: [
        //         "#f7b452",
        //         "#ef6c91",
        //         "#8e6ed5",
        //         "#6abc91",
        //         "#5ac5c3",
        //         "#7297e3",
        //         "#9bc86e",
        //         "#ebd562",
        //         "#d499b9"
        //     ],
        //     handlers: {
        //         getAuthorInfoById: (authorId) => {
        //             return new Promise((resolve, reject) => {

        //                 let author = authors.find((a) => a.id + '' === authorId);

        //                 console.log("user info retrieved from server: " + authorId);

        //                 if(author) {
        //                     resolve(author);
        //                 }else{
        //                     reject("user not found");
        //                 }

        //             });
        //         }
        //     }
        // },
        image: {
          handlers: {
            imageDataURIUpload: dataURI => {
              return new Promise(resolve => {
                resolve(testUrl);
              });
            },
            imageSrcUpload: src => {
              return new Promise(resolve => {
                resolve(testUrl);
              });
            },
            imageUploadError: err => {
              console.log("image upload error: " + err);
            }
          }
        }
      };
      let toolbarOptions = [
        ["bold", "italic", "underline", "strike"],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [
          { list: "ordered" },
          { list: "bullet" },
          "task-list",
          { indent: "+1" },
          { indent: "-1" }
        ],
        [{ color: [] }, { background: [] }],
        [{ direction: "rtl" }],
        [{ align: [] }],
        ["blockquote", "code-block", "link", "image"],
        [{ script: "sub" }, { script: "super" }]
      ];

      let quillOptions = {
        modules: {
          // toolbar: toolbarOptions,
          toolbar: toolbarOptions,
          "task-list": true
        },
        theme: "snow"
      };
      let editor = new Editor("#container", editorOptions, quillOptions);
      editor.on(EditorEvents.imageSkipped, () => {
        console.log("image skipped");
      });
      editor.on(EditorEvents.documentLoaded, () => {
        console.log("document loaded");
      });

      editor.on(EditorEvents.synchronizationError, err => {
        console.log("connection error");
        console.log(err);
      });

      let websocketEndpoint = "ws://192.168.2.212:8080";
      // let websocketEndpoint = "ws://127.0.0.1:8080";
      editor.syncThroughWebsocket(websocketEndpoint, "examples", this.docName);

      let socket = new ReconnectingWebSocket(websocketEndpoint);

      // let connection = new ShareDB.Connection(socket);

      // let doc = connection.get("examples", "test-doc");

      // Create a hidden quill editor to parse delta to html

      // let editorContainer = document.createElement("div");
      // editorContainer.style.display = "none";

      // let quill = new Quill(editorContainer);
      // doc.fetch(err => {
      //   if (err) {
      //     console.log(err);
      //     return;
      //   }

      //   let delta = doc.data;
      //   quill.setContents(delta);
      //   // document.querySelector(".content").innerHTML = quill.root.innerHTML;
      //   doc.destroy();
      //   socket.close();

      //   // editor.on(EditorEvents.editorTextChanged, delta => {
      //   //   let del = delta.oldDelta.compose(delta.delta);
      //   //   debugger
      //   //   quill.setContents(del);
      //   //   // document.querySelector(".content").innerHTML = quill.root.innerHTML;
      //   // });
      // });
    },
    showDoc (row) {
      // debugger
      document.querySelector('.ql-toolbar').remove()
      this.docName = row.name
      this.getConnect()
    }
  },
  mounted() {
    this.getConnect();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped></style>
