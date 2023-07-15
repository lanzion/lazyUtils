/*
 * @Descripttion: 数据处理
 * @version:
 * @Author: lzy
 * @Date: 2023-07-15 20:55:04
 * @LastEditors: lzy
 * @LastEditTime: 2023-07-15 20:56:04
 */

/**
 * @name: 将数组转化处理为树形结构
 * @param {array} items：扁平数组
 * @param {String} key: 处理的key值
 * @param {String} rootKey：根目录key值
 * @param {String} pid_key：父级key字段
 * @param {String} children：子级存放的字段
 * @return {Object} {result, itemMap} result: 树形结构 ,itemMap {key: {}}
 */
export const arrayToTree = (
  items,
  rootKey = "0",
  key = 'id',
  pid_key = "parent_id",
  children = "children",
) => {
  const result = []; // 存放结果集
  const itemMap = {}; //
  for (const item of items) {
    const id = item[key];
    const pid = item[pid_key];

    if (!itemMap[id]) {
      itemMap[id] = {
        [children]: null,
      };
    }

    itemMap[id] = {
      ...item,
      [children]: itemMap[id][children],
    };

    const treeItem = itemMap[id];

    if (pid === rootKey) {
      result.push(treeItem);
    } else {
      if (!itemMap[pid]) {
        itemMap[pid] = {
          [children]: [],
        };
      }
      itemMap[pid][children] = itemMap[pid][children] || [];
      itemMap[pid][children].push(treeItem);
    }
  }
  return { result, itemMap };
};

/**
 * @name: 树形数据[tree]转数组[Array]
 * @param {Array} tree 树形数据
 * @param {String} children 子级key
 * @returns {Array}
 */
export const treeToArray = (tree, children = 'children') => {
  if (!Array.isArray(tree) || !tree.length) return []
  let result = []
  tree.forEach(v => {
    result.push(v)
    if (v[children]) {
      result.push(...treeToArray(v[children], children))
    }
  })
  return result
}

/**
 * @name: 根据指定元素查找所有父级
 * @param {Array} treeData
 * @param {*} id
 * @param {String} key 要查找的key值
 * @param {String} parentKey 父级key值
 * @returns {Array} 所有父级
 */
export const findParents = (treeData, id, key = 'id', parentKey = 'parentId', children = 'children') => {
  let allparents = []
  if (treeData.length == 0) return
  let findele = (data, id) => {
    if (!id) return
    data.forEach(item => {
      if (item[key] === id) {
        allparents.unshift(item)
        findele(treeData, item[parentKey])
      } else {
        if (item[children]) {
          findele(item[children], id)
        }
      }
    })
  }
  findele(treeData, id)
  return allparents
}

/**
 * @name: 获取所有子级key集合
 * @param {Array} array 树形数组数据
 * @param {String} key 要查找key值
 * @param {String} children 子级key
 * @return {Array}
 */
export const getKeysByTree = (array, key = 'id', children = 'children') => {
  let list = []
  for (let index = 0; index < array.length; index++) {
    const item = array[index]
    list.push(item[key])
    if (item[children] && item[children].length) {
      getIdsByTree(item[children], key, children, list)
    }
  }
  return list
}

/**
 * @name: 获取树形节点
 * @param {Array} tree 树形数据
 * @param {*} value 要查找的值
 * @param {String} key 根据该字段查找 默认 'id
 * @param {String} children 子节点字段
 * @return {Object}
 */
export const findNode = function (tree, value, key = 'id', children = 'children') {
  const list = [...tree]
  let p = list.shift()
  while (p) {
    if (p[key] === value) return p
    if (p[children]) {
      list.push(...p[children])
    }
    p = list.shift()
  }
  return null
}

/**
 * @name: 根据数量切割数组
 * @param {Number} chunk 每组切割的数量
 * @param {Array} source 切割的数组
 * @returns {Array} 多维数据
 */
export const arrayChunk = (chunk = 3, source = []) => {
  let result = []
  for (let i = 0, j = source.length; i < j; i += chunk) {
    result.push(source.slice(i, i + chunk))
  }
  return result
}
