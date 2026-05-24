import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MapPin, UserPlus } from "lucide-react";
import type { Role } from "@/lib/roles";
import { INDIAN_STATES, DISTRICTS_BY_STATE, MANDALS_BY_DISTRICT } from "@/lib/locations";

export const AssignmentPanel = ({ staffList, viewerRole, onAssignSuccess }: { staffList: any[]; viewerRole: Role; onAssignSuccess?: () => void }) => {
  const { token } = useAuth();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [parentUserId, setParentUserId] = useState<string>("");
  const [geoState, setGeoState] = useState("");
  const [geoDistrict, setGeoDistrict] = useState("");
  const [geoMandal, setGeoMandal] = useState("");
  const [geoVillage, setGeoVillage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
    setGeoState(user.state || "");
    setGeoDistrict(user.district || "");
    setGeoMandal(user.mandal || "");
    setGeoVillage(user.village || "");
    // User object typically returns manager as parent_user_id or manager_id
    setParentUserId(user.parent_user_id ? String(user.parent_user_id) : "");
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGeoState(e.target.value);
    setGeoDistrict(""); // Reset district when state changes
    setGeoMandal(""); // Reset mandal when state changes
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setGeoDistrict(e.target.value);
    setGeoMandal(""); // Reset mandal when district changes
  };


  const canAssignHierarchy = ["admin", "md", "regional_head", "cluster_head"].includes(viewerRole);
  const canAssignGeo = ["admin", "md", "coordinator"].includes(viewerRole);

  const assignReporting = async () => {
    if (!selectedUser || !parentUserId) return;
    setIsSubmitting(true);
    try {
      await apiRequest(`/api/admin/users/${selectedUser.id}/assign`, {
        method: "PUT",
        token,
        body: { parent_user_id: parseInt(parentUserId, 10) },
      });
      toast.success(`Assigned ${selectedUser.name} successfully`);
      setSelectedUser(null);
      if (onAssignSuccess) onAssignSuccess();
    } catch (err: any) {
      toast.error(err.message || "Failed to assign");
    } finally {
      setIsSubmitting(false);
    }
  };

  const assignGeo = async () => {
    if (!selectedUser) return;
    setIsSubmitting(true);
    try {
      await apiRequest(`/api/admin/users/${selectedUser.id}/geo`, {
        method: "PUT",
        token,
        body: { state: geoState, district: geoDistrict, mandal: geoMandal, village: geoVillage },
      });
      toast.success(`Updated geo for ${selectedUser.name}`);
      setSelectedUser(null);
      if (onAssignSuccess) onAssignSuccess();
    } catch (err: any) {
      toast.error(err.message || "Failed to assign geo");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTargetRoles = () => {
    switch (viewerRole) {
      case "regional_head": return ["CLUSTER_HEAD", "COORDINATOR"];
      case "cluster_head": return ["COORDINATOR", "STAFF"];
      case "coordinator": return ["STAFF"];
      default: return [];
    }
  };

  const targetRoles = getTargetRoles();
  const validTargets = viewerRole === "admin" || viewerRole === "md" 
    ? staffList 
    : staffList.filter(s => targetRoles.includes(String(s.role || "").toUpperCase()));

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50 px-5 py-4">
          <h3 className="text-lg font-bold text-slate-900">Manage Assignments</h3>
          <p className="text-sm text-slate-500">Select a team member to assign them to a manager or location.</p>
        </div>

        {selectedUser ? (
          <div className="p-5">
            <div className="mb-4 flex items-center justify-between rounded-lg bg-blue-50 p-3">
              <div>
                <p className="text-sm font-semibold text-blue-900">Editing: {selectedUser.name}</p>
                <p className="text-xs text-blue-700">{selectedUser.role} • {selectedUser.email}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setSelectedUser(null)}>Cancel</Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {canAssignHierarchy && (
                <div className="space-y-3 rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center gap-2 text-slate-800">
                    <UserPlus className="h-4 w-4" />
                    <h4 className="font-semibold">Assign Manager (Hierarchy)</h4>
                  </div>
                  <select 
                    className="w-full rounded-md border border-slate-300 p-2 text-sm"
                    value={parentUserId}
                    onChange={(e) => setParentUserId(e.target.value)}
                  >
                    <option value="">Select a manager...</option>
                    {staffList.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                    ))}
                  </select>
                  <Button disabled={isSubmitting || !parentUserId} onClick={assignReporting} className="w-full">
                    Assign Manager
                  </Button>
                </div>
              )}

              {canAssignGeo && (
                <div className="space-y-3 rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center gap-2 text-slate-800">
                    <MapPin className="h-4 w-4" />
                    <h4 className="font-semibold">Assign Location (Geo)</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <select 
                      className="rounded-md border p-2 text-sm" 
                      value={geoState} 
                      onChange={handleStateChange}
                    >
                      <option value="">Select State...</option>
                      {geoState && !INDIAN_STATES.includes(geoState) && (
                        <option value={geoState}>{geoState}</option>
                      )}
                      {INDIAN_STATES.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>

                    {DISTRICTS_BY_STATE[geoState] ? (
                      <select 
                        className="rounded-md border p-2 text-sm" 
                        value={geoDistrict} 
                        onChange={handleDistrictChange}
                      >
                        <option value="">Select District...</option>
                        {geoDistrict && !DISTRICTS_BY_STATE[geoState].includes(geoDistrict) && (
                          <option value={geoDistrict}>{geoDistrict}</option>
                        )}
                        {DISTRICTS_BY_STATE[geoState].map(district => (
                          <option key={district} value={district}>{district}</option>
                        ))}
                      </select>
                    ) : (
                      <input 
                        placeholder="District" 
                        className="rounded-md border p-2 text-sm" 
                        value={geoDistrict} 
                        onChange={handleDistrictChange} 
                        disabled={!geoState}
                      />
                    )}

                    {MANDALS_BY_DISTRICT[geoDistrict] ? (
                      <select 
                        className="rounded-md border p-2 text-sm" 
                        value={geoMandal} 
                        onChange={e => setGeoMandal(e.target.value)}
                      >
                        <option value="">Select Mandal...</option>
                        {geoMandal && !MANDALS_BY_DISTRICT[geoDistrict].includes(geoMandal) && (
                          <option value={geoMandal}>{geoMandal}</option>
                        )}
                        {MANDALS_BY_DISTRICT[geoDistrict].map(mandal => (
                          <option key={mandal} value={mandal}>{mandal}</option>
                        ))}
                      </select>
                    ) : (
                      <input 
                        placeholder="Mandal" 
                        className="rounded-md border p-2 text-sm" 
                        value={geoMandal} 
                        onChange={e => setGeoMandal(e.target.value)} 
                        disabled={!geoDistrict}
                      />
                    )}

                    <input placeholder="Village" className="rounded-md border p-2 text-sm" value={geoVillage} onChange={e => setGeoVillage(e.target.value)} />
                  </div>
                  <Button disabled={isSubmitting} onClick={assignGeo} className="w-full">
                    Update Location
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {validTargets
                .filter(s => String(s.status || '').toUpperCase() !== 'PENDING')
                .map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {s.name}
                      {String(s.status || '').toUpperCase() === 'PENDING' && (
                        <Badge className="bg-amber-100 text-amber-700 text-[9px] px-1.5 py-0">Pending</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline">{s.role}</Badge></TableCell>
                  <TableCell className="text-sm text-slate-500">
                    {[s.village, s.mandal, s.district, s.state].filter(Boolean).join(", ") || "Unassigned"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="secondary" onClick={() => handleSelectUser(s)}>
                      Manage
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {validTargets.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-slate-500">No assignable team members found in your scope.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};
