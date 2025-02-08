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
import { useNavigation, useRoute } from "@react-navigation/native";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { SafeAreaView } from "react-native-safe-area-context";
import moment from "moment";
import ReviewBox from "../../components/ReviewBox";
import {
  getCurrentUser,
  instance,
  setHeader,
} from "../../redux/actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "@backpackapp-io/react-native-toast";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const SpecialCategory = () => {
  const {
    params: { id },
  } = useRoute();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { navigate } = useNavigation();
  const [dayData, setDayData] = useState([]);
  const [review, setReview] = useState(false);
  const [heart, setHeart] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [category, setCategory] = useState({});
  const [loader, setLoader] = useState("");
  const [slotData, setSlotData] = useState({});
  const [slotLoader, setSlotLoader] = useState(false);
  const [slotError, setSlotError] = useState("");
  const [bookingLoader, setBookingLoader] = useState(false);

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

  const getCategoryById = async () => {
    try {
      setLoader(true);
      const { data } = await instance.get(`/cat/${id}`);
      if (data.success) {
        setLoader(false);
        setCategory(data.data);
      }
    } catch (error) {
      setLoader(false);
    }
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

  const getAvailableSlots = async () => {
    try {
      setSlotLoader(true);

      const { data } = await instance.post("/appt/timeslot", {
        employee: category?.category?.employee,
        apptFor: id,
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
        } else {
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
      return navigate("Login", { screen: "SpecialCategory", id });
    }
    try {
      setBookingLoader(true);
      await setHeader();
      const { data } = await instance.post("/appt/book", {
        employee: category?.category?.employee,
        apptFor: id,
        startTime: date.split("T")[0] + "T" + time.split("T")[1],
      });
      if (data.success) {
        setBookingLoader(false);
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

  const handleSetFavourite = async () => {
    if (!isAuthenticated) {
      return navigate("Login", { screen: "SpecialCategory", id });
    }
    try {
      await setHeader();
      const { data } = await instance.post("/user/favs", {
        id,
      });
      if (data.success) {
        toast.success(data.message);
        dispatch(getCurrentUser());
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    setDayData(memoizedValue);
    getCategoryById();
  }, [memoizedValue]);

  useEffect(() => {
    if (date) {
      getAvailableSlots();
    }
    if (isAuthenticated) {
      const favs = user?.favourites?.map((f) => f?._id?.toString());
      if (favs.includes(id)) {
        setHeart(true);
      }
    }
  }, [date, isAuthenticated]);

  return (
    <View>
      <ScrollView className="bg-slate-100">
        <Image
          style={{ height: 300, width: "100%" }}
          source={{ uri: category.category?.imageUrl }}
        />
        <View
          style={{
            margin: 10,
            marginTop: -60,
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
          }}
          className="bg-white mx-3 p-4"
        >
          <View className="flex  flex-row items-center justify-between  mb-6">
            <Text className="font-Logo text-3xl text-gray-800">
              {category.category?.name}
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
              category?.category?.description
            )}
          </Text>

          {review ? (
            <View style={{ paddingBottom: 200 }}>
              {category?.reviews.length > 0 ? (
                category?.reviews?.map((r) => (
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
              {date && (
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
        </View>

        <View className="flex items-center justify-evenly flex-row p-4 w-[100vw] py-4">
          <TouchableOpacity
            onPress={() => {
              handleSetFavourite(), setHeart(!heart);
            }}
            className="border-red-400 border-[1px] mr-4 rounded-2xl py-4 px-4"
          >
            {heart ? (
              <FontAwesome name="heart" size={20} color={"#f87171"} />
            ) : (
              <FontAwesome name="heart-o" size={20} color={"#f87171"} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleBooking}
            disabled={bookingLoader}
            className="bg-red-400 py-5 w-[74vw] rounded-2xl"
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
    </View>
  );
};

export default SpecialCategory;
