interface TreeNode<T extends TreeNode<T>> {
  path: (string | number)[];
  children?: Record<string, T>;
}

export const find = <T extends TreeNode<T>>(root: T, path: T["path"]) => {
  let current = root;

  for (const key of path) {
    if (current.path.join() === path.join()) return current;
    else if (!current.children || !current.children[key]) return;
    current = current.children[key];
  }

  return current.path.join() === path.join() ? current : undefined;
};

export const insert = <T extends TreeNode<T>>(root: T, node: T) => {
  if (node.path.length === 0) return;

  const parent = find(root, node.path.slice(0, -1));
  if (!parent) return;

  if (!parent.children) parent.children = {};
  parent.children[node.path[node.path.length - 1]] = node;
};

export const update = <T extends TreeNode<T>>(
  root: T,
  path: T["path"],
  patch: Partial<T>
) => {
  const parrent = find(root, path.slice(0, -1));
  const target = find(root, path);
  if (!parrent || !target) return;

  parrent.children![path[path.length - 1]] = { ...target, ...patch };
};

export const remove = <T extends TreeNode<T>>(root: T, path: T["path"]) => {
  const parrent = find(root, path.slice(0, -1));
  if (!parrent) return;

  delete parrent.children![path[path.length - 1]];
};
