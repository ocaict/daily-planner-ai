class Category {
  constructor(data = {}) {
    this.id = data.id ?? null;
    this.name = data.name ?? '';
    this.color = data.color ?? '#808080';
    this.icon = data.icon ?? null;
    this.sortOrder = data.sortOrder ?? 0;
  }

  static fromRow(row) {
    return new Category({
      id: row.id,
      name: row.name,
      color: row.color,
      icon: row.icon,
      sortOrder: row.sort_order,
    });
  }

  toRow() {
    return {
      id: this.id,
      name: this.name,
      color: this.color,
      icon: this.icon,
      sort_order: this.sortOrder,
    };
  }
}

export { Category };
