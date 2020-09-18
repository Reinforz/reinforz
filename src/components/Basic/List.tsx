import React, { useContext, useState, useEffect } from "react";
import { Checkbox } from "@material-ui/core";
import CancelIcon from '@material-ui/icons/Cancel';
import { useTheme } from '@material-ui/core/styles';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import useSound from 'use-sound';
import usePrevious from "react-use/lib/usePrevious";

import Icon from "../Basic/Icon"

import { ExtendedTheme, ListProps, ISettings } from "../../types";

import SettingsContext from "../../context/SettingsContext";

import "./List.scss";

export default function (props: ListProps<Record<string, any>>) {
  const { children, items, setItems, header, fields, icons } = props;
  const [selectedItems, setSelectedItems] = useState([] as any[]);
  const theme = useTheme() as ExtendedTheme;
  const settings = useContext(SettingsContext) as ISettings;
  const [playOn] = useSound(process.env.PUBLIC_URL + "/sounds/pop-on.mp3", { volume: 0.25 });
  const [playOff] = useSound(process.env.PUBLIC_URL + "/sounds/pop-off.mp3", { volume: 0.25 });
  const [deleteItem] = useSound(process.env.PUBLIC_URL + "/sounds/delete.mp3", { volume: 0.25 });
  const prevItems = usePrevious(items);
  const prev_items_ids = prevItems?.map(prevItem => prevItem._id) ?? []
  const new_items = items.filter(item => !prev_items_ids.includes(item._id)).map(item => item._id)

  useEffect(() => {
    setSelectedItems([...selectedItems, ...new_items])
    // eslint-disable-next-line
  }, [items])

  return children({
    ListComponent: <div className="List" style={{ backgroundColor: theme.color.base }}>
      <div className="List-header" style={{ backgroundColor: theme.color.dark, color: theme.palette.text.primary }}>
        <Checkbox color="primary" key={"checkbox"} onClick={(e) => {
          if ((e.target as any).checked) {
            if (settings.sound) playOn();
            setSelectedItems(items.map(item => item._id));
          }
          else {
            if (settings.sound) playOff();
            setSelectedItems([])
          }
        }} checked={items.length !== 0 && selectedItems.length === items.length} />
        {selectedItems.length}/{items.length}
        <div className="List-header-title">{header}</div>
        <div className="List-header-icons">
          <Icon icon={CancelIcon} popoverText={`Remove ${selectedItems.length} selected items`} className={"List-header-icons--cancel"} key={"deleteicon"} onClick={() => {
            if (settings.sound) deleteItem();
            props.onDelete && props.onDelete(items.filter(item => selectedItems.includes(item._id)))
            setItems(items.filter(item => !selectedItems.includes(item._id)));
            setSelectedItems([])
          }} />
        </div>
      </div>
      <div className="List-content" style={{ color: theme.palette.text.primary, backgroundColor: theme.color.dark }}>
        {items.length > 0 ? <TransitionGroup component={null}>
          {items.map((item, index) => {
            const { _id } = item;
            return <CSSTransition
              key={_id}
              appear
              timeout={{
                enter: /* !new_items.includes(_id) ?  */(index + 1) * 250 /* : (index + 1 - new_items.length) * 250 */,
                exit: (index + 1) * 250
              }}
              classNames={settings.animation ? "fade" : undefined}
            >
              <div className="List-content-item" key={_id} style={{ backgroundColor: theme.color.light }}>
                {icons?.map(icon => icon(index, _id))}
                <div className="List-content-item-icons">
                  <Checkbox color="primary" className="List-content-item-icons--checkbox" key={_id + "checkbox" + index} onClick={(e) => {
                    if ((e.target as any).checked) {
                      if (settings.sound) playOn();
                      setSelectedItems([...selectedItems, _id])
                    }
                    else {
                      if (settings.sound) playOff();
                      setSelectedItems(selectedItems.filter(item => item !== _id))
                    }
                  }} checked={selectedItems.includes(_id)} value={_id} />
                  <Icon icon={CancelIcon} className="List-content-item-icons--cancel" key={_id + "icon" + index} onClick={() => {
                    if (settings.sound) deleteItem();
                    props.onDelete && props.onDelete([item])
                    setSelectedItems(selectedItems.filter(item => item !== _id))
                    setItems(items.filter(item => item._id !== _id));
                  }} popoverText="Delete this item" />
                </div>
                {fields.map((field, index) => <div className="List-content-item-field" key={_id + field + index}>{typeof field === "string" ? item[field] : field(item)}</div>)}
              </div>
            </CSSTransition>
          })}
        </TransitionGroup> : <div style={{ fontSize: "1.25em", fontWeight: "bold", position: "absolute", transform: "translate(-50%,-50%)", top: "50%", left: "50%", textAlign: 'center' }}>No items uploaded</div>}
      </div>
    </div>,
    ListState: {
      selectedItems
    },
    ListUtils: {
      setSelectedItems
    }
  })
}

// import React, { useContext, useState, useEffect } from "react";
// import { Checkbox } from "@material-ui/core";
// import CancelIcon from '@material-ui/icons/Cancel';
// import { useTheme } from '@material-ui/core/styles';
// import { CSSTransition } from 'react-transition-group';
// import useLifecycles from "react-use/lib/useLifecycles";
// import { usePrevious } from 'react-use';

// import Icon from "../Basic/Icon"

// import { ExtendedTheme, ListProps, ISettings, ListItemProps } from "../../types";

// import SettingsContext from "../../context/SettingsContext";

// import "./List.scss";

// const playOn = new Audio(process.env.PUBLIC_URL + "/sounds/pop-on.mp3");
// playOn.volume = 0.5;
// const playOff = new Audio(process.env.PUBLIC_URL + "/sounds/pop-off.mp3");
// playOff.volume = 0.5;
// const deleteItem = new Audio(process.env.PUBLIC_URL + "/sounds/delete.mp3");
// deleteItem.volume = 0.5;

// const ListItem = React.memo((props: ListItemProps<any>) => {
//   const settings = useContext(SettingsContext) as ISettings;
//   const theme = useTheme() as ExtendedTheme;
//   const [mounted, setMounted] = useState(true);
//   useLifecycles(() => {
//     console.log(`${item.subject} - ${item.title} ${item._id} mounted`)
//     setMounted(true)
//   }, () => console.log(`${item.subject} - ${item.title} ${item._id} unmounted`));
//   const { item, item: { _id }, index, fields, setItems, icons, setSelectedItems, isChecked } = props;
//   return <CSSTransition
//     timeout={{
//       enter: (index + 1) * 250,
//       exit: 250
//     }}
//     in={mounted}
//     classNames={settings.animation ? "fade" : undefined}
//     appear
//   >
//     <div className="List-content-item" key={_id} style={{ backgroundColor: theme.color.light }}>
//       {icons?.map(icon => icon(index, _id))}
//       <div className="List-content-item-icons">
//         <Checkbox color="primary" className="List-content-item-icons--checkbox" key={_id + "checkbox" + index} onClick={(e) => {
//           if ((e.target as any).checked) {
//             if (settings.sound) playOn.play();
//             setSelectedItems("add", _id)
//           }
//           else {
//             if (settings.sound) playOff.play();
//             setSelectedItems("remove", _id)
//           }
//         }} checked={isChecked} value={_id} />
//         <Icon icon={CancelIcon} className="List-content-item-icons--cancel" key={_id + "icon" + index} onClick={() => {
//           if (settings.sound) deleteItem.play();
//           setMounted(false)
//           setTimeout(() => {
//             setSelectedItems("remove", _id)
//             setItems(_id);
//             props.onDelete && props.onDelete([item])
//           }, 275)
//         }} popoverText="Delete this item" />
//       </div>
//       {fields.map((field, index) => <div className="List-content-item-field" key={_id + field + index}>{typeof field === "string" ? item[field] : field(item)}</div>)}
//     </div>
//   </CSSTransition>
// })

// export default function (props: ListProps<Record<string, any>>) {
//   const { children, items, setItems, header, fields, icons, onDelete } = props;
//   const [selectedItems, setSelectedItems] = useState([] as any[]);
//   const theme = useTheme() as ExtendedTheme;
//   const settings = useContext(SettingsContext) as ISettings;
//   const prevItems = usePrevious(items);

//   useEffect(() => {
//     const prev_items_ids = prevItems?.map(prevItem => prevItem._id) ?? []
//     const new_items = items.filter(item => !prev_items_ids.includes(item._id)).map(item => item._id)
//     setSelectedItems([...selectedItems, ...new_items])
//     // eslint-disable-next-line
//   }, [items])

//   return children({
//     ListComponent: <div className="List" style={{ backgroundColor: theme.color.base }}>
//       <div className="List-header" style={{ backgroundColor: theme.color.dark, color: theme.palette.text.primary }}>
//         <Checkbox color="primary" key={"checkbox"} onClick={(e) => {
//           if ((e.target as any).checked) {
//             if (settings.sound) playOn.play();
//             setSelectedItems(items.map(item => item._id));
//           }
//           else {
//             if (settings.sound) playOff.play();
//             setSelectedItems([])
//           }
//         }} checked={items.length !== 0 && selectedItems.length === items.length} />
//         {selectedItems.length}/{items.length}
//         <div className="List-header-title">{header}</div>
//         <div className="List-header-icons">
//           <Icon icon={CancelIcon} popoverText={`Remove ${selectedItems.length} selected items`} className={"List-header-icons--cancel"} key={"deleteicon"} onClick={() => {
//             if (settings.sound) deleteItem.play();
//             onDelete && onDelete(items.filter(item => selectedItems.includes(item._id)))
//             setItems(items.filter(item => !selectedItems.includes(item._id)));
//             setSelectedItems([]);
//           }} />
//         </div>
//       </div>
//       <div className="List-content" style={{ color: theme.palette.text.primary, backgroundColor: theme.color.dark }}>
//         {items.length > 0 ?
//           items.map((item, index) => <ListItem onDelete={onDelete} key={item._id} isChecked={selectedItems.includes(item._id)} setItems={(_id) => setItems(items.filter(item => item._id !== _id))} setSelectedItems={(action, _id) => {
//             if (action === "add") setSelectedItems([...selectedItems, _id]);
//             else if (action === "remove") setSelectedItems(selectedItems.filter(item => item !== _id))
//           }} item={item} index={index} fields={fields} icons={icons} />)
//           : <div style={{ fontSize: "1.25em", fontWeight: "bold", position: "absolute", transform: "translate(-50%,-50%)", top: "50%", left: "50%", textAlign: 'center' }}>No items uploaded</div>}
//       </div>
//     </div>,
//     ListState: {
//       selectedItems
//     },
//     ListUtils: {
//       setSelectedItems
//     }
//   })
// }