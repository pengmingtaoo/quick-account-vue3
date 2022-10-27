import { defineComponent, PropType } from "vue";
import s from "./Tabs.module.scss";
export const Tabs = defineComponent({
  props: {
    classPrefix: {
      type: String,
    },
    selected: {
      type: String as PropType<string>,
    },
  },
  emits:['update:selected'],
  setup(props, context) {
    return () => {
      const tabs = context.slots.default?.();
      if (!tabs) return () => null;
      for (let i = 0; i < tabs.length; i++) {
        if (tabs[i].type !== Tab) {
          throw new Error("<Tab>only accepts</Tab> as children");
        }
      }

      return (
        <div class={[s.tabs, props.classPrefix + "_tabs"]}>
          <ol class={[s.tabs_nav, props.classPrefix + "_tabs_nav"]}>
            {tabs.map((item) => (
              <li
                class={[
                  item.props?.name === props.selected
                    ? [s.selected, props.classPrefix + "_selected"]
                    : "",
                  props.classPrefix + "_tabs_nav_item",
                ]}
                // onClick={() => props.onUpdateSelected?.(item.props?.name)}
                onClick={() =>
                  context.emit("update:selected", item.props?.name)
                }
              >
                {item.props?.name}
              </li>
            ))}
          </ol>
          <div>{tabs.find((item) => item.props?.name === props.selected)}</div>
        </div>
      );
    };
  },
});

export const Tab = defineComponent({
  props: {
    name: {
      type: String as PropType<string>,
    },
  },
  setup(props, context) {
    return () => <div>{context.slots.default?.()}</div>;
  },
});
