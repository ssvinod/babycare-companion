import { JsonDatabaseProvider } from "../database/jsonDatabaseProvider.js";
export class BaseRepository {
    constructor(collection, Model) {
        this.collection = collection;
        this.Model = Model;
        this.db = new JsonDatabaseProvider();
        this.db.initialize();
    }
    loadAll() {
        return this.db
            .load(this.collection)
            .map(item => new this.Model(item));
    }
    saveAll(items) {
        this.db.save(
            this.collection,
            items
        );
    }
    save(item) {
        const items =
            this.loadAll();
        const index =
            items.findIndex(
                x => x.id === item.id
            );
        if (index >= 0)
            items[index] = item;
        else
            items.push(item);
        this.saveAll(items);
        return item;
    }
    remove(id) {
        this.saveAll(
            this.loadAll()
                .filter(
                    item => item.id !== id
                )
        );
    }
    findById(id) {
        return this.loadAll()
            .find(
                item => item.id === id
            ) ?? null;
    }
    findAll() {
        return this.loadAll();
    }
}