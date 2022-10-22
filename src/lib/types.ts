export type Callback = (...args: any) => any;
export type Deps = { [k: string]: Set<Callback> };
export type StateType = Record<string | number | symbol, unknown>;

export type StoreWithGetters<G> = {
  readonly [k in keyof G]: G[k] extends (...args: any[]) => infer R ? R : never;
};

export type _GettersTree<S extends StateType> = Record<
  string,
  ((state: S) => any) | (() => any)
>;




// 这里改变this指向是为了增加类似提示
export type Options<S extends StateType, A, C> = {
  state: S;
  computed?: C & ThisType<S & StoreWithGetters<C>> & _GettersTree<S>;
  actions?: A & ThisType<S & A & StoreWithGetters<C>>;
};

// 这里还要加上两个类型，patch, useWatch()
export type Store<S, A, C> = S &
  A &
  StoreWithGetters<C> & {
    patch(v: Partial<S> | ((arg: S) => unknown)): unknown;
    watch(v: keyof S): unknown;
  };

function defineStore<
  S extends StateType,
  A extends Record<string, Callback>,
  C = {}
>(options: Options<S, A, C>) {
  function u1seStore(): Store<S, A, C> {
    const store = {};

    // 这里不要离它，指定了返回值即可。
    return store as any;
  }

  return u1seStore;
}

const u1seStore = defineStore({
  state: {
    count: 0,
    name: "savage",
  },
  computed: {
    shit() {},
    dbCount(state) {
      return state.count * 2;
    },
  },
  actions: {
    add() {
      console.debug(this.shit);
      console.debug(this.dbCount);
      this.count = 999;
      this.print();
    },
    print() {
      this.add();
      console.debug(this.shit);
      console.debug(this.count);
    },
  },
});

const store = u1seStore();
store.patch((state) => {
  state.count = 3;
});

