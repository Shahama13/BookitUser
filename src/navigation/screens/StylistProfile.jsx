import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import moment from "moment";
import ReviewBox from "../../components/ReviewBox";
import { useNavigation, useRoute } from "@react-navigation/native";
import Specialcategory from "../../components/Specialcategory";
import { instance, setHeader } from "../../redux/actions/userActions";
import { useSelector } from "react-redux";
import { toast } from "@backpackapp-io/react-native-toast";
import Feather from "@expo/vector-icons/Feather";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const StylistProfile = () => {
  const { navigate } = useNavigation();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { params } = useRoute();
  const [loader, setLoader] = useState(false);
  const [service, setService] = useState("");
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [review, setReview] = useState(false);
  const [specialServices, setSpecialServices] = useState(false);
  const [dayData, setDayData] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [slotData, setSlotData] = useState({});
  const [slotLoader, setSlotLoader] = useState(false);
  const [slotError, setSlotError] = useState("");
  const [bookingLoader, setBookingLoader] = useState(false);

  function capitalizeLastWord(sentence) {
    // Trim to avoid trailing spaces and split the sentence into words
    const words = sentence.trim().split(" ");

    // Get the last word, capitalize its first letter, and keep the rest of the word as is
    const lastWord = words[words.length - 1];
    const capitalizedLastWord =
      lastWord.charAt(0).toUpperCase() + lastWord.slice(1);

    // Replace the last word with the capitalized version
    words[words.length - 1] = capitalizedLastWord;

    // Join the words back into a sentence
    return words.join(" ");
  }

  const segregateTimeSlots = (filteredIntervals) => {
    const timeSlots = {
      morning: [],
      afternoon: [],
      evening: [],
      night: [],
    };
    filteredIntervals.forEach((interval) => {
      const intervalDate = new Date(interval);
      const hour = intervalDate.getHours(); // Get local hour of the interval

      if (hour >= 3 && hour < 12) {
        timeSlots.morning.push(interval);
      } else if (hour >= 12 && hour < 16) {
        timeSlots.afternoon.push(interval);
      } else if (hour >= 16 && hour < 19) {
        timeSlots.evening.push(interval);
      } else if (hour >= 19 || hour < 3) {
        timeSlots.night.push(interval);
      }
    });
    setSlotData(timeSlots);
  };

  function getWeekDates() {
    const today = new Date();
    const weekDates = [];

    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(today);
      dayDate.setDate(today.getDate() + i);
      const index = dayDate.getDay();
      // Convert to ISO 8601 format
      const isoDate = dayDate.toISOString();
      weekDates.push({ date: isoDate, day: daysOfWeek[index] });
    }
    return weekDates;
  }

  const memoizedValue = useMemo(() => getWeekDates(), []);

  const getEmployeeDetails = async () => {
    try {
      setLoader(true);
      const { data } = await instance.get(`/emp/${params?.id}`);
      if (data.success) {
        setLoader(false);
        setEmployeeDetails(data.data);
      }
    } catch (error) {
      setLoader(false);
    }
  };

  const getAvailableSlots = async () => {
    try {
      setSlotLoader(true);
      const { data } = await instance.post("/appt/timeslot", {
        employee: params.id,
        apptFor: service._id,
        date: date,
      });
      if (data.success) {
        setSlotLoader(false);
        setSlotError("");
        if (date.split("T")[0] === new Date().toISOString().split("T")[0]) {
          const filteredIntervals = data.data.intervals.filter((i) => {
            const intervalDate = new Date(i); // Extract time part from interval
            return intervalDate > new Date();
          });
          segregateTimeSlots(filteredIntervals);
          // setSlotData(intervals);
        } else {
          // setSlotData(data.data.intervals);
          segregateTimeSlots(data.data.intervals);
        }
      }
    } catch (error) {
      setSlotError(error.response.data.message);
      setSlotData([]);
      setSlotLoader(false);
    }
  };

  const handleBooking = async () => {
    if (!isAuthenticated) {
      return navigate("Login", { screen: "StylistProfile", id: params.id });
    }
    try {
      setBookingLoader(true);
      await setHeader();
      const { data } = await instance.post("/appt/book", {
        employee: params.id,
        apptFor: service._id,
        startTime: date.split("T")[0] + "T" + time.split("T")[1],
      });
      if (data.success) {
        setBookingLoader(false);
        setService("");
        setTime("");
        setDate("");
        toast.success("Appointment booked");
        navigate("MyAppointments");
      }
    } catch (error) {
      toast.error(error.response.data.message);
      setBookingLoader(false);
    }
  };

  useEffect(() => {
    setDayData(memoizedValue);
    getEmployeeDetails();
  }, [memoizedValue, params]);

  useEffect(() => {
    if (date && service) {
      getAvailableSlots();
    }
  }, [date, service]);

  return (
    <>
      <ScrollView className="bg-slate-200 flex-1">
        <Image
          style={{ height: 530, width: "100%" }}
          source={{
            uri: employeeDetails?.employee?.avatar?.url,
          }}
        />

        <View
          style={{
            margin: 10,
            marginTop: -200,
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
          }}
          className="bg-white mx-3 p-4"
        >
          <View className="flex  flex-row items-center justify-between  mb-6">
            <Text className="font-Logo text-3xl text-gray-800">
              {employeeDetails?.employee?.fullname}
            </Text>
            <TouchableOpacity onPress={() => setReview(!review)}>
              {review ? (
                <Text className="font-MonsB text-red-400">‹ Go Back</Text>
              ) : (
                <Text className="font-MonsB text-red-400">See Reviews ›</Text>
              )}
            </TouchableOpacity>
          </View>
          <Text className={`mb-10 font-Mons ${loader && "text-center"}`}>
            {loader ? (
              <ActivityIndicator size={"large"} color={"#000000"} />
            ) : (
              employeeDetails?.employee?.description
            )}
          </Text>

          {review ? (
            <View style={{ paddingBottom: 150 }}>
              {employeeDetails?.reviews.length > 0 ? (
                employeeDetails?.reviews
                  ?.reverse()
                  .map((r) => (
                    <ReviewBox
                      uri={r?.user?.avatar?.url}
                      name={r?.user?.fullname}
                      rating={r.rating}
                      comment={r.comment}
                      createdAt={r.createdAt}
                      key={r._id}
                    />
                  ))
              ) : (
                <Text className="font-MonsB text-center my-7 text-red-400">
                  No reviews yet
                </Text>
              )}
            </View>
          ) : (
            <>
              <View className="flex flex-row items-center justify-between mb-4">
                <Text className="text-black text-lg font-MonsB">SERVICES</Text>
                {employeeDetails?.category?.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setSpecialServices(!specialServices)}
                  >
                    {specialServices ? (
                      <Text className="font-MonsB text-red-400">‹ Basics</Text>
                    ) : (
                      <Text className="font-MonsB text-red-400">
                        Special Services ›
                      </Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>
              {specialServices ? (
                <FlatList
                  data={employeeDetails?.category || []}
                  renderItem={({ item }) => (
                    <Specialcategory
                      rounded={true}
                      id={item._id}
                      uri={item.imageUrl}
                      name={item.name}
                      description={item.description}
                    />
                  )}
                  contentContainerStyle={{ columnGap: 5 }}
                  keyExtractor={(item) => item?._id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                />
              ) : (
                <FlatList
                  data={employeeDetails?.employee?.speciality || []}
                  horizontal
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => setService(item)}
                      className={`${
                        service._id === item._id
                          ? "border-[1px] border-red-400"
                          : "bg-slate-100"
                      } px-10 py-4 rounded-2xl mb-7`}
                    >
                      <Text
                        className={`${
                          service._id === item._id
                            ? "text-red-400 "
                            : "text-gray-800 "
                        } text-base font-Mons`}
                      >
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item?._id}
                  contentContainerStyle={{ columnGap: 7 }}
                  showsHorizontalScrollIndicator={false}
                />
              )}
              <View style={{ margin: 10 }} />
              <Text className="text-black text-lg my-2 font-MonsB">
                PICK A DATE
              </Text>
              <View className="flex flex-row mt-2 mb-3">
                <FlatList
                  data={dayData}
                  horizontal
                  keyExtractor={(item) => item?.date}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => setDate(item.date)}
                      className={`${
                        date === item.date
                          ? "border-[1px] border-red-400"
                          : "bg-slate-100"
                      } rounded-2xl mb-7 px-3 py-2`}
                    >
                      <View className="flex justify-center items-center px-4 py-4">
                        <Text
                          className={`${
                            date === item.date
                              ? "text-red-400 "
                              : "text-gray-700 "
                          } mb-3  text-center font-Mons`}
                        >
                          {item.day}
                        </Text>
                        <Text
                          className={`${
                            date === item.date
                              ? "text-red-400"
                              : "text-gray-800"
                          } text-2xl font-Mons`}
                        >
                          {item.date.slice(8, 10)}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  contentContainerStyle={{ columnGap: 10 }}
                  showsHorizontalScrollIndicator={false}
                />
              </View>

              {service && date && (
                <Text className="text-black text-lg my-2 font-MonsB">
                  AVAILABLE SLOTS
                </Text>
              )}
              <View
                style={{ paddingBottom: 100, flexWrap: "wrap" }}
                className="flex flex-row flex-wrap mt-2 "
              >
                {slotLoader ? (
                  <View
                    style={{ marginVertical: 20 }}
                    className="flex items-center justify-center my-12 w-full"
                  >
                    <ActivityIndicator size={"large"} color={"#000000"} />
                  </View>
                ) : slotError ? (
                  <View className="my-12 w-full">
                    <Text className="text-red-400 font-MonsB text-center">
                      {capitalizeLastWord(slotError)}
                    </Text>
                  </View>
                ) : slotData?.morning?.length === 0 &&
                  slotData?.evening?.length === 0 &&
                  slotData?.afternoon?.length === 0 &&
                  slotData?.night?.length === 0 ? (
                  <View className="my-12 w-full">
                    <Text className="text-red-400 font-MonsB text-center">
                      No slots available
                    </Text>
                  </View>
                ) : (
                  service &&
                  date && (
                    <>
                      {slotData?.morning?.length > 0 && (
                        <>
                          <View
                            className="flex flex-row items-center justify-start gap-2 w-full"
                            style={{ marginTop: 10, marginBottom: 15 }}
                          >
                            <Feather name="sun" size={25} color={"#f87171"} />
                            <Text className="font-MonsB text-red-400">
                              Morning
                            </Text>
                          </View>

                          {slotData?.morning?.map((item, i) => (
                            <TouchableOpacity
                              key={i}
                              onPress={() => setTime(item)}
                              className={`${
                                time === item
                                  ? "border-[1px] border-red-400"
                                  : "bg-slate-100"
                              } py-5 px-10 rounded-2xl mb-2`}
                              style={{ marginRight: 10, marginBottom: 10 }}
                            >
                              <Text
                                className={`${
                                  time === item
                                    ? "text-red-400"
                                    : "text-gray-700"
                                } text-base font-Mons`}
                              >
                                {moment(item).format("LT")}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </>
                      )}

                      {slotData?.afternoon?.length > 0 && (
                        <>
                          <View
                            className="flex flex-row items-center justify-start gap-2 w-full"
                            style={{ marginTop: 10, marginBottom: 15 }}
                          >
                            <Feather name="sun" size={30} color={"#f87171"} />
                            <Text className="font-MonsB text-red-400">
                              Afternoon
                            </Text>
                          </View>

                          {slotData?.afternoon?.map((item, i) => (
                            <TouchableOpacity
                              key={i}
                              onPress={() => setTime(item)}
                              className={`${
                                time === item
                                  ? "border-[1px] border-red-400"
                                  : "bg-slate-100"
                              } py-5 px-10 rounded-2xl mb-2`}
                              style={{ marginRight: 10, marginBottom: 10 }}
                            >
                              <Text
                                className={`${
                                  time === item
                                    ? "text-red-400"
                                    : "text-gray-700"
                                } text-base font-Mons`}
                              >
                                {moment(item).format("LT")}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </>
                      )}

                      {slotData?.evening?.length > 0 && (
                        <>
                          <View
                            className="flex flex-row items-center justify-start gap-2 w-full"
                            style={{ marginTop: 10, marginBottom: 15 }}
                          >
                            <Feather name="cloud" size={30} color={"#f87171"} />
                            <Text className="font-MonsB text-red-400">
                              Evening
                            </Text>
                          </View>

                          {slotData?.evening?.map((item, i) => (
                            <TouchableOpacity
                              key={i}
                              onPress={() => setTime(item)}
                              className={`${
                                time === item
                                  ? "border-[1px] border-red-400"
                                  : "bg-slate-100"
                              } py-5 px-10 rounded-2xl mb-2`}
                              style={{ marginRight: 10, marginBottom: 10 }}
                            >
                              <Text
                                className={`${
                                  time === item
                                    ? "text-red-400"
                                    : "text-gray-700"
                                } text-base font-Mons`}
                              >
                                {moment(item).format("LT")}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </>
                      )}
                      {slotData?.night?.length > 0 && (
                        <>
                          <View
                            className="flex flex-row items-center justify-start gap-2 w-full"
                            style={{ marginTop: 10, marginBottom: 15 }}
                          >
                            <Feather name="moon" size={30} color={"#f87171"} />
                            <Text className="font-MonsB text-red-400">
                              Night
                            </Text>
                          </View>

                          {slotData?.night?.map((item, i) => (
                            <TouchableOpacity
                              key={i}
                              onPress={() => setTime(item)}
                              className={`${
                                time === item
                                  ? "border-[1px] border-red-400"
                                  : "bg-slate-100"
                              } py-5 px-10 rounded-2xl mb-2`}
                              style={{ marginRight: 10, marginBottom: 10 }}
                            >
                              <Text
                                className={`${
                                  time === item
                                    ? "text-red-400"
                                    : "text-gray-700"
                                } text-base font-Mons`}
                              >
                                {moment(item).format("LT")}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </>
                      )}
                    </>
                  )
                )}
              </View>
            </>
          )}
        </View>
      </ScrollView>
      <View className="absolute bottom-0 left-0  bg-white">
        <View className="flex flex-row mt-3 px-5 justify-between">
          {time && date && (
            <Text className="text-gray-700 font-Quic">
              {moment(date.split("T")[0] + "T" + time.split("T")[1]).format(
                "LLLL"
              )}
            </Text>
          )}
          <Text className="text-gray-700 font-Quic ml-auto">
            {service?.name}
          </Text>
        </View>

        <View className="p-4 w-[100vw] py-4">
          <TouchableOpacity
            disabled={bookingLoader}
            onPress={handleBooking}
            className="bg-red-400 py-5 w-full rounded-2xl"
          >
            {bookingLoader ? (
              <ActivityIndicator size={"small"} color={"#FFFFFF"} />
            ) : (
              <Text className="font-MonsB text-white text-center">
                Book Appointment
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default StylistProfile;
