import { View, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AppointmentBox from "../../components/AppointmentBox";
import { instance, setHeader } from "../../redux/actions/userActions";
import { useIsFocused } from "@react-navigation/native";
import EmptyFavs from "../../components/EmptyFavs";

const MyAppointments = () => {
  const [loader, setLoader] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const focus = useIsFocused();

  const getMyAppts = async () => {
    try {
      setLoader(true);
      await setHeader();
      const { data } = await instance.get("/appt/hist");
      if (data.success) {
        setLoader(false);
        setAppointments(data.data);
      }
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };

  useEffect(() => {
    getMyAppts();
  }, [focus]);

  return (
    <SafeAreaView className="flex-1 bg-white pb-4">
      {loader ? (
        <View className="flex items-center justify-center flex-1">
          <ActivityIndicator size={"large"} color={"#000000"} />
        </View>
      ) : appointments.length === 0 ? (
        <EmptyFavs
          title={" Book the best stylists"}
          description={"Ease of use with flexible timings"}
        />
      ) : (
        <ScrollView>
          <View className="mt-5 px-4">
            {appointments?.map((a) => (
              <AppointmentBox
                status={a.status}
                review={a.review}
                createdAt={a.createdAt}
                startTime={a.startTime}
                endTime={a.endTime}
                apptFor={a.apptFor}
                uri={a.employee?.avatar?.url}
                name={a.employee?.fullname}
                employeeId={a.employee?._id}
                key={a._id}
                id={a._id}
              />
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default MyAppointments;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 22,
    backgroundColor: "#000000",
    opacity: 0.9,
    zIndex: 1,
  },
  modalView: {
    margin: 20,
    backgroundColor: "#FFFFFF",
    width: "90%",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    opacity: 1,
    zIndex: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
