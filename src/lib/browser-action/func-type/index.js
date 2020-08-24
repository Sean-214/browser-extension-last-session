module.exports = {
  /**
   * 选择单击图标的功能信息列表
   */
  FUNC_TYPE_INFOS: [
    {
      name: 'funcType_undo',
      commands: {
        description: '__MSG_funcType_undo__',
      },
    },
    {
      name: 'funcType_recent',
    },
    {
      name: 'funcType_openInTab',
      commands: {
        suggested_key: {
          default: 'Alt+R',
        },
        description: '__MSG_funcType_openInTab__',
      },
    },
    {
      name: 'funcType_openInPopup',
    },
  ],
};
