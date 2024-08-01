import { StyleSheet, Dimensions } from 'react-native';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const HomeStyle = StyleSheet.create({
	preloader: {
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		position: 'absolute',
	},

	navigationView: {
		width: '100%',
		height: 60,
		backgroundColor: '#8bc34a',
		alignSelf: 'center',
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
	},

	titleText: {
		fontSize: 24,
		fontWeight: '700',
		color: 'white'
	},

	settingButton:{
		position: 'absolute',
		width: 80,
		height: 50,
		bottom: 5,
		right: 10,
		alignItems: 'center',
		justifyContent: 'center',
	},

	settingIcon: {
		fontSize: 28,
		color: 'white'
	},

	settingMenu: {
		position: 'absolute',
		top: 0,
		right: 0,
		width: DEVICE_WIDTH * 0.5,
		height: 120,
		zIndex: 2,
	},

	settingMenuItem: {
		width: '100%',
		height: 36,      
		backgroundColor: '#888',
		alignItems: 'flex-start',
		justifyContent: 'center',
		paddingLeft: 5
	},

	settingMenuText: {
		fontSize: 14,
		color: 'white',
		margin: 5
	}, 

	contentView: {
		width: '100%',
		flex: 1,
		alignSelf: 'center',
		alignItems: 'center',
		justifyContent: 'flex-start',
		zIndex: 1,
	},

	// styles for savedInfo

	savedInfo: {
		margin: 10,
		borderBottomWidth: 1, // Line thickness
    	borderBottomColor: '#ccc', // Line color
	},

	deleteButton: {
		position: 'absolute', // Position absolutely within title view
	    right: 0, // Align to the right
	    top: 0, // Align to the top
	    padding: 10, // Adjust padding as needed
	},

	deleteButtonText: {
		fontSize: 12
	},

	savedInfoItemText: {
		fontSize: 10,
	    textAlign: 'center', // Center text horizontally
	},

	// styles for downloading status
	downloadingStatus: {
		margin: 10
	},

	statusItem: {
	    height: 20,
	    width: '100%',
	    justifyContent: 'center', // Center content vertically
	    alignItems: 'center', // Center content horizontally
	},
	itemText: {
		fontSize: 14,
	    textAlign: 'center', // Center text horizontally
	},

	downloadingButtons: {
	    flexDirection: 'row',
	    justifyContent: 'space-between', // Space buttons evenly
	    marginTop: 20,
	},
	button: {
	    flex: 1, // Allow buttons to grow equally
	    marginHorizontal: 5, // Space between buttons
	    justifyContent: 'center',
	    alignItems: 'center',
	    padding: 10,
	    backgroundColor: '#ddd',
	    borderRadius: 5,
	},
	buttonText: {
	    fontSize: 16,
	},

	// styles for add torrent buttons
	addButtonsContainer: {
		position: 'absolute',
		bottom: 50,
		right: 10,
		width: 100,
		height: 100,
		flexDirection: 'column', // Stack children vertically
		backgroundColor: 'transparent'
	},
	addTorrentLinkButton: {
		flex: 1, // Takes up half the height of the container
		justifyContent: 'center', // Center the text vertically
		alignItems: 'center', // Center the text horizontally
		backgroundColor: '#8bc34a', // Optional: Add a background color
	},
	gap: {
		height: 10, // Adjust the height of the gap as needed
		backgroundColor: 'transparent', // Transparent gap
	},
	webView: {
		flex: 1, // Takes up half the width of the container
		backgroundColor: 'white', // Optional: Add a background color
	},

	// styles for modal
	modalContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark background with transparency
	},
	modalContent: {
		width: 320,
		backgroundColor: '#fff',
		padding: 20,
		borderRadius: 10,
		alignItems: 'center',
	},
	modalTitle: {
		fontSize: 18,
		marginBottom: 10,
	},
	textInput: {
		width: '100%',
		height: 40,
		borderColor: '#ccc',
		borderWidth: 1,
		borderRadius: 5,
		paddingHorizontal: 10,
		marginBottom: 20,
	},
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-end', // Align buttons to the right
		width: '100%',
	},
	modalButton: {
	    backgroundColor: '#8bc34a', // Change this color as needed
	    padding: 10,
	    borderRadius: 5,
	    marginHorizontal: 5,
	    alignItems: 'center',
	    width: 100
	},
	modalButtonText: {
	    color: '#324818',
	    fontSize: 14,
	},

	cellView: {
		width: DEVICE_WIDTH,
		height: 217,
		marginTop: 5,

	},

	cellContentView: {    
		flex: 1,
		marginHorizontal: 16,
		marginBottom: 10,
		borderRadius: 10,
		borderColor: '#ddd',
		borderWidth: 1,
		backgroundColor: '#f4f4f4',
	},

	cellTitleView: {
		width: '100%',
		height: 32,
		backgroundColor: '#888',
		alignItems: 'center',
		justifyContent: 'center'
	},

	cellTitleText: {
		fontSize: 16,
		color: 'white'
	},

	scrollView: {
		width: '100%',
		height: 100,
	},

});

export default HomeStyle;