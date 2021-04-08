<template>
  <div class="hello">
    <div
      id="zzh"
      style="margin:0px;padding:0px;position:absolute;width:100%;height:100%;left: 0px;top: 0;"
    ></div>
    <button style="position: absolute; bottom: 0;" @click="del">销毁</button>
  </div>
</template>

<script>
export default {
  name: "excel",
  props: {
    msg: String
  },
  data() {
    return {};
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      var options = {
        container: "zzh", //luckysheet为容器id
        title: "zzh", //表 头名
        lang: "zh", //中文
        column: 26, //列数
        row: 30, //行数
        showtoolbar: true, //是否显示工具栏
        // showinfobar: true, //是否显示顶部信息栏
        showinfobar: false, //是否显示顶部信息栏
        allowEdit: true, //是否允许前端编辑
        showstatisticBar: false,
        showsheetbarConfig: {
          add: true, //Add worksheet
          menu: true, //Worksheet management menu
          sheet: true //Worksheet display
        },
        sortAndFilter: true,
        myFolderUrl: "https://www.cnblogs.com/javascript9527/", //<左上角的“后退”按钮的链接
        // functionButton:
        //   '<button id="" class="btn btn-primary" style="padding:3px 6px;font-size: 12px;margin-right: 10px;">download</button> <button id="" class="btn btn-primary btn-danger" style=" padding:3px 6px; font-size: 12px; margin-right: 10px;">share</button> <button id="luckysheet-share-btn-title" class="btn btn-primary btn-danger" style=" padding:3px 6px; font-size: 12px; margin-right: 10px;">show data</button>', //右上角按钮
        cellRightClickConfig: {
          //自定义配置单元右键菜单
          copy: true, // 复制
          copyAs: true, // 复制为
          paste: true, // 粘贴
          insertRow: true, // 插入行insert row
          insertColumn: true, // 插入列insert column
          deleteRow: true, // 删除选中行的数据 delete the selected row
          deleteColumn: true, // 删除选中列的数据delete the selected column
          deleteCell: false, // delete cell
          hideRow: true, // hide the selected row and display the selected row
          hideColumn: true, // hide the selected column and display the selected column
          rowHeight: true, // 设置行高
          columnWidth: true, // 设置行宽
          clear: true, // 清空选定内容clear content
          matrix: false, //矩阵 matrix operation selection
          sort: false, // 排序sort selection
          filter: true, //筛选 filter selection
          chart: false, //图表生成 chart generation
          image: false, //插入图片 insert picture
          link: false, // 插入连接，比如网址之类insert link
          data: false, //数据校验 data verification
          cellFormat: false //设置单元格格式，锁定单元格格式，隐藏公示等 Set cell format
        },
        showtoolbarConfig: {
          undoRedo: true, //Undo redo
          paintFormat: true, //Format brush
          currencyFormat: true, //currency format
          percentageFormat: true, //Percentage format
          numberDecrease: true, //'Decrease the number of decimal places'
          numberIncrease: true, //'Increase the number of decimal places
          moreFormats: true, //'More Formats'
          font: true, //'font'
          fontSize: true, //'Font size'
          bold: true, //'Bold (Ctrl+B)'
          italic: true, //'Italic (Ctrl+I)'
          strikethrough: true, //'Strikethrough (Alt+Shift+5)'
          underline: true, // 'Underline (Alt+Shift+6)'
          textColor: true, //'Text color'
          fillColor: true, //'Cell color'
          border: true, //'border'
          mergeCell: true, //'Merge cells'
          horizontalAlignMode: true, //'Horizontal alignment'
          verticalAlignMode: true, //'Vertical alignment'
          textWrapMode: true, //'Wrap mode'
          textRotateMode: true, //'Text Rotation Mode'
          image: true, // 'Insert picture'
          link: true, // 'Insert link'
          chart: true, //'chart' (the icon is hidden, but if the chart plugin is configured, you can still create a new chart by right click)
          postil: true, //'comment'
          pivotTable: true, //'PivotTable'
          function: true, //'formula'
          frozenMode: true, //'freeze mode'
          sortAndFilter: true, //'Sort and filter'
          conditionalFormat: true, //'Conditional Format'
          dataVerification: true, // 'Data Verification'
          splitColumn: true, //'Split column'
          screenshot: true, //'screenshot'
          findAndReplace: true, //'Find and Replace'
          protection: false, // 'Worksheet protection'
          print: false // 'Print'
        }
      };
      luckysheet.create(options);
    },
    del() {
      luckysheet.destroy();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
