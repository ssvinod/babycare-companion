import React from "react";
import {
  View,
 Text,
 StyleSheet,
 Pressable,
} from "react-native";

import { Feeding } from "../../models/Feeding";

interface Props{
    feeding:Feeding;
    onDelete:()=>void;
}

export default function FeedingCard({
    feeding,
    onDelete,
}:Props){

    return(

<View style={styles.card}>

<Text style={styles.time}>
{feeding.time}
</Text>

<Text style={styles.type}>
{feeding.type}
</Text>

<Text style={styles.qty}>
{feeding.quantity} ml
</Text>

<Pressable
style={styles.delete}
onPress={onDelete}
>

<Text style={styles.deleteText}>
Delete
</Text>

</Pressable>

</View>

    );

}

const styles=StyleSheet.create({

card:{
backgroundColor:"#fff",
padding:18,
borderRadius:18,
marginBottom:16,
},

time:{
fontWeight:"700",
fontSize:18,
},

type:{
marginTop:8,
fontSize:16,
},

qty:{
marginTop:4,
color:"#666",
},

delete:{
marginTop:14,
alignSelf:"flex-end",
},

deleteText:{
color:"#EF4444",
fontWeight:"700",
}

});