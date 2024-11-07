
import PropTypes from 'prop-types';

export const Uiii = ({ deviceData, editData, isEditing, handleInputChange, toggleEdit, addupdate, macadd ,model,serialNo}) => {
    return (
        deviceData.d ? (
            <div className="flex-col justify-center items-center">
                <div className='flex justify-end mr-14'>
                     {/* Edit/Save buttons */}
                     {!isEditing ? (
                        <button
                            onClick={toggleEdit}
                            className="px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
                        >
                            Edit
                        </button>
                    ) : (
                        <div className="flex ">
                            <button
                                onClick={addupdate}
                                className="px-6 py-2 mr-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-green-600 rounded-lg hover:bg-green-500 focus:outline-none focus:ring focus:ring-green-300 focus:ring-opacity-80"
                            >
                                Save
                            </button>
                            <button
                                onClick={toggleEdit}
                                className="px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-red-600 rounded-lg hover:bg-red-500 focus:outline-none focus:ring focus:ring-red-300 focus:ring-opacity-80"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
                {/* Card 1 starts */}
                <div className='flex w-full justify-center items-center '>
                <div className="w-full max-w-sm px-4 py-3 bg-[#333333] rounded-md shadow-md dark:bg-gray-800">
                    <div className="flex-col items-center justify-between ">
                        <h2 className="text-sm font-semibold text-white  ">MAC: {macadd}</h2>
                        <h2  className="text-sm font-semibold text-white  ">Model:{model}</h2>
                        <h2  className="text-sm font-semibold text-white ">Serial No:{serialNo}</h2>
                    </div>

                    <div>
                        <div>
                            <label className="block mb-1 text-xs text-white ">Date:</label>
                            <input
                            type="text"
                            name="d.d.d"
                            value={editData.d?.d?.d || ""}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full p-1 mb-1 font-medium border text-white  bg-[#494F55] border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-xs text-white ">Feedback:</label>
                            <input
                            type="number"
                            name="d.c.f"
                            value={editData.d?.c?.f || ""}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full p-1 mb-1 font-medium border text-white  bg-[#494F55] border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>
                        <div>
                            <label className="block mb-1 text-xs text-white ">Device Mode:</label>
                             <input
                            type="text"
                            name="d.c.m"
                            value={editData.d?.c?.m || ""}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full p-1 mb-1 font-medium border text-white  bg-[#494F55] border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                             <label className="block mb-1 text-xs text-white ">Blue Phase:</label>
                            <select
                            name="d.v.b"
                            value={editData.d?.v?.b ? "Yes" : "No"}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full p-2 mb-1 font-medium border text-white  bg-[#494F55] border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                            </select>
                        </div>

                        <div>
                             <label className="block mb-2 text-xs text-white ">Red Phase:</label>
                            <select
                            name="d.v.r"
                            value={editData.d?.v?.r ? "Yes" : "No"}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full p-1 mb-1 font-medium border text-white  bg-[#494F55] border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                             >
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                            </select>
                        </div>

                        <div>
                            <label className="block mb-2 text-xs text-white ">Yellow Phase:</label>
                            <select
                            name="d.v.y"
                            value={editData.d?.v?.y ? "Yes" : "No"}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full p-1 mb-2 font-medium border text-white  bg-[#494F55] border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2 text-xs text-white ">Voltage:</label>
                            <input
                            type="text"
                            name="d.v.v"
                            value={editData.d?.v?.v || ""}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full p-1 mb-2 font-medium border text-white  bg-[#494F55] border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                           />
                        </div>
                        <div>
                            <label className="block mb-2 text-xs text-white ">Voltage Fault:</label>
                            <select
                            name="d.v.vf"
                            value={editData.d?.v?.vf ? "Yes" : "No"}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full p-1 mb-1 font-medium border text-white  bg-[#494F55] border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                           </select>
                        </div>

                        <h2 className="text-sm font-bold mb-2 text-white ">Instruction</h2>
                        <div>
                            <label className="block mb-2 text-xs text-white ">Instruction Motor command:</label>
                            <input
                            type="text"
                            name="i.m.m"
                            value={isEditing ? editData.i?.m?.m || "" : deviceData.i?.m?.m || "N/A"}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full p-1 mb-1 font-medium border text-white  bg-[#494F55] border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>



                    </div>
                

                </div>



                {/* Card 1 ends */}

                {/* card 2 starts */}

                <div className="w-full max-w-sm m-5 px-4 py-3 bg-[#333333] rounded-md shadow-md dark:bg-gray-800">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-bold mb-1 text-white ">Protection</h2>
                    </div>

                    <div>

                        <div>
                            <label className="block mb-1 text-xs text-white ">Protection Mode:</label>
                            <input
                            type="text"
                            name="i.p.p"
                            value={isEditing ? editData.i?.p?.p || "" : deviceData.i?.p?.p || "N/A"}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full p-1 mb-1 bg-[#494F55] text-white  font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <h2 className="text-sm font-bold mb-1 text-white ">Initials</h2>
                        <div>
                            <label className="block mb-1 text-xs text-white ">Delay Time:</label>
                            <input
                            type="text"
                            name="in.dt"
                            value={isEditing ? editData.in?.dt || "" : deviceData.in?.dt || "N/A"}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full p-1 mb-1 text-white  bg-[#494F55] font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-xs text-white ">Minimum Voltage:</label>
                            <input
                            type="text"
                            name="in.mnv"
                            value={isEditing ? editData.in?.mnv || "" : deviceData.in?.mnv || "N/A"}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full p-1 mb-1 bg-[#494F55] text-white  font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-xs text-white ">Phase:</label>
                            <input
                            type="text"
                            name="in.p"
                            value={isEditing ? editData.in?.p || "" : deviceData.in?.p || "N/A"}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full p-1 mb-1 text-white  bg-[#494F55] font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                             />
                        </div>
                        <div>
                            <label className="block mb-1 text-xs text-white ">Model Data For Server:</label>
                            <input
                            type="text"
                            name="m.m"
                            value={isEditing ? editData.m?.m || "" : deviceData.m?.m || "N/A"}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full p-1 mb-1 text-white  bg-[#494F55] font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 text-xs text-white ">Model:</label>
                             <input
                            type="text"
                            name="model"
                            value={isEditing ? editData.model || "" : deviceData.model || "N/A"}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full p-1 mb-1 font-medium border text-white  bg-[#494F55] border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-xs text-white ">Network:</label>
                            <input
                            type="text"
                            name="n"
                            value={isEditing ? editData.n || "" : deviceData.n || "N/A"}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full p-1 mb-1 font-medium text-white  bg-[#494F55] border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-xs text-white ">Power:</label>
                            <select
                            name="power"
                            value={isEditing ? (editData.power ? "Yes" : "No") : (deviceData.power ? "Yes" : "No")}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full p-1 mb-1 font-medium text-white  border bg-[#494F55] border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                            </select>
                        </div>

                        <div>
                            <label className="block mb-2 text-xs text-white ">Pressure available:</label>
                            <select
                            name="in.pa"
                            value={isEditing ? (editData.in?.pa ? "Yes" : "No") : (deviceData.in?.pa ? "Yes" : "No")}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full p-1 mb-1 font-medium border text-white  bg-[#494F55] border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2 text-xs text-white ">Recharge:</label>
                            <select
                            name="in.r"
                            value={isEditing ? (editData.in?.r ? "Yes" : "No") : (deviceData.in?.r ? "Yes" : "No")}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full p-1 mb-1 font-medium border text-white  bg-[#494F55] border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                            </select>
                        </div>

                    </div>

                </div>
                </div>
                {/* Card 2 ends */}


                {/* <div className="bg-white p-4  w-full max-w-[670px] border-gray-400 rounded-xl"> */}
                    {/* <h2 className="text-sm font-bold mb-4">Data {macadd}</h2>
                    <div>
                        <label className="block mb-2 text-xs">Date:</label>
                        <input
                            type="text"
                            name="d.d.d"
                            value={editData.d?.d?.d || ""}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full p-2 mb-2 font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-xs">Feedback:</label>
                        <input
                            type="number"
                            name="d.c.f"
                            value={editData.d?.c?.f || ""}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full p-2 mb-2 font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-xs">Device Mode:</label>
                        <input
                            type="text"
                            name="d.c.m"
                            value={editData.d?.c?.m || ""}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full p-2 mb-2 font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-xs">Blue Phase:</label>
                        <select
                            name="d.v.b"
                            value={editData.d?.v?.b ? "Yes" : "No"}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full p-2 mb-2 font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                    <div>
                        <label className="block mb-2 text-xs">Red Phase:</label>
                        <select
                            name="d.v.r"
                            value={editData.d?.v?.r ? "Yes" : "No"}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full p-2 mb-2 font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                    <div>
                        <label className="block mb-2 text-xs">Yellow Phase:</label>
                        <select
                            name="d.v.y"
                            value={editData.d?.v?.y ? "Yes" : "No"}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full p-2 mb-2 font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                    <div>
                        <label className="block mb-2 text-xs">Voltage:</label>
                        <input
                            type="text"
                            name="d.v.v"
                            value={editData.d?.v?.v || ""}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full p-2 mb-2 font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-xs">Voltage Fault:</label>
                        <select
                            name="d.v.vf"
                            value={editData.d?.v?.vf ? "Yes" : "No"}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full p-2 mb-2 font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                    <h2 className="text-sm font-bold mb-4">Instruction</h2>
                    <div>
                        <label className="block mb-2 text-xs">Instruction Motor command:</label>
                        <input
                            type="text"
                            name="i.m.m"
                            value={isEditing ? editData.i?.m?.m || "" : deviceData.i?.m?.m || "N/A"}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full p-2 mb-2 font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div> */}

                    {/* <h2 className="text-sm font-bold mb-4">Protection</h2>
                    <div>
                        <label className="block mb-2 text-xs">Protection Mode:</label>
                        <input
                            type="text"
                            name="i.p.p"
                            value={isEditing ? editData.i?.p?.p || "" : deviceData.i?.p?.p || "N/A"}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full p-2 mb-2 font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <h2 className="text-sm font-bold mb-4">Initials</h2>
                    <div>
                        <label className="block mb-2 text-xs">Delay Time:</label>
                        <input
                            type="text"
                            name="in.dt"
                            value={isEditing ? editData.in?.dt || "" : deviceData.in?.dt || "N/A"}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full p-2 mb-2 font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div> */}
                    {/* <div>
                        <label className="block mb-2 text-xs">Minimum Voltage:</label>
                        <input
                            type="text"
                            name="in.mnv"
                            value={isEditing ? editData.in?.mnv || "" : deviceData.in?.mnv || "N/A"}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full p-2 mb-2 font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-xs">Phase:</label>
                        <input
                            type="text"
                            name="in.p"
                            value={isEditing ? editData.in?.p || "" : deviceData.in?.p || "N/A"}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full p-2 mb-2 font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-xs">Model Data For Server:</label>
                        <input
                            type="text"
                            name="m.m"
                            value={isEditing ? editData.m?.m || "" : deviceData.m?.m || "N/A"}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full p-2 mb-2 font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div> */}
                    {/* <div>
                        <label className="block mb-2 text-xs">Model:</label>
                        <input
                            type="text"
                            name="model"
                            value={isEditing ? editData.model || "" : deviceData.model || "N/A"}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full p-2 mb-2 font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-xs">Network:</label>
                        <input
                            type="text"
                            name="n"
                            value={isEditing ? editData.n || "" : deviceData.n || "N/A"}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full p-2 mb-2 font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-xs">Power:</label>
                        <select
                            name="power"
                            value={isEditing ? (editData.power ? "Yes" : "No") : (deviceData.power ? "Yes" : "No")}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full p-2 mb-2 font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div> */}
                    {/* <div>
                        <label className="block mb-2 text-xs">Pressure available:</label>
                        <select
                            name="in.pa"
                            value={isEditing ? (editData.in?.pa ? "Yes" : "No") : (deviceData.in?.pa ? "Yes" : "No")}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full p-2 mb-2 font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                    <div>
                        <label className="block mb-2 text-xs">Recharge:</label>
                        <select
                            name="in.r"
                            value={isEditing ? (editData.in?.r ? "Yes" : "No") : (deviceData.in?.r ? "Yes" : "No")}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full p-2 mb-2 font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div> */}
                    {/* Edit/Save buttons */}
                    {/* {!isEditing ? (
                        <button
                            onClick={toggleEdit}
                            className="px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
                        >
                            Edit
                        </button>
                    ) : (
                        <div className="flex mt-4">
                            <button
                                onClick={addupdate}
                                className="px-6 py-2 mr-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-green-600 rounded-lg hover:bg-green-500 focus:outline-none focus:ring focus:ring-green-300 focus:ring-opacity-80"
                            >
                                Save
                            </button>
                            <button
                                onClick={toggleEdit}
                                className="px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-red-600 rounded-lg hover:bg-red-500 focus:outline-none focus:ring focus:ring-red-300 focus:ring-opacity-80"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div> */}
            </div>
        ) : (

            <div>l</div>
        )
    )
}
Uiii.propTypes = {
    deviceData: PropTypes.object.isRequired,
    editData: PropTypes.object.isRequired,
    isEditing: PropTypes.bool.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    toggleEdit: PropTypes.func.isRequired,
    addupdate: PropTypes.func.isRequired,
    macadd: PropTypes.string.isRequired,
    model: PropTypes.number.isRequired,
    serialNo: PropTypes.string.isRequired,
}