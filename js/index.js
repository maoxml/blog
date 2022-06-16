window.$docsify = {
    alias: {
        '/.*/_sidebar.md': '/_sidebar.md',
      },
    loadSidebar: true,
    sidebarDisplayLevel: 1, // 折叠
    subMaxLevel: 2, //自定义侧边栏同时也可以开启目录功能

    // coverpage: true, //封面页
    mergeNavbar: true, //小屏设备下合并导航栏到侧边栏。
    loadNavbar: true,//导航
    name: '',
    maxLevel: 3,
    themeColor: '#39BAE8',
    repo: 'maox.ml',
    formatUpdated: '{MM}/{DD} {HH}:{mm}',//更新时间格式

    // 添加一键拷贝
    copyCode: {
      buttonText: {
        '/zh-cn/': '点击复制',
      },
    },
    //搜索
    search: {
        placeholder: '搜一搜',
        noData: '抱歉！找不到对应的结果'
      },
    // 添加上下页按钮
    pagination: {
      previousText: '上一章',
      nextText: '下一章',
      crossChapter: true,
      crossChapterText: true,
    },
    
  }