import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/AuthContext";

export function useUserCollection<T = any>(subcollection: string) {
  const { user } = useAuth();
  const [data, setData] = useState<(T & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setData([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const q = query(collection(db, "users", user.uid, subcollection));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as (T & { id: string })[];
      setData(items);
      setLoading(false);
    }, () => {
      setData([]);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user, subcollection]);

  return { data, loading };
}
